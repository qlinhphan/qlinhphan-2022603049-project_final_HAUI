from __future__ import annotations

from threading import Lock
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from agent_analysist_ad_dis import agent_analytical_ad_dis
from agent_check_input import agent_check_inputs
from agent_recommend_via_rag import agent_recommend_via_rags
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import END, StateGraph


class ChatRequest(BaseModel):
    question: str | None = Field(
        default=None,
        description="Mo ta thong tin benh nhan. Co the bo trong khi tra loi buoc phan tich.",
    )
    thread_id: str = Field(default="default", description="Ma phien hoi thoai")
    dif: str | None = Field(
        default=None,
        description="Cau tra loi cho cau hoi phan tich them, vi du: co/khong",
    )


class ChatResponse(BaseModel):
    thread_id: str
    question: str | None = None
    status: str
    answer: str
    recommend_rag: str | None = None
    check_inp: str | None = None
    analysis: str | None = None
    ask_for_analysis: bool = False
    analysis_prompt: str | None = None


class GraphSessionStore:
    def __init__(self) -> None:
        self._lock = Lock()
        self._sessions: dict[str, Any] = {}

    def get(self, thread_id: str):
        with self._lock:
            graph = self._sessions.get(thread_id)
            if graph is None:
                graph = build_graph()
                self._sessions[thread_id] = graph
            return graph


class ConversationSessionStore:
    def __init__(self) -> None:
        self._lock = Lock()
        self._sessions: dict[str, dict[str, Any]] = {}

    def get(self, thread_id: str) -> dict[str, Any]:
        with self._lock:
            session = self._sessions.get(thread_id)
            if session is None:
                session = {}
                self._sessions[thread_id] = session
            return dict(session)

    def update(self, thread_id: str, **values: Any) -> None:
        with self._lock:
            session = self._sessions.setdefault(thread_id, {})
            session.update(values)


def _wants_analysis(value: str | None) -> bool:
    if value is None:
        return False

    normalized = value.strip().lower()
    return normalized in {"co", "có", "cÃ³", "yes", "y", "true", "1"}


def _declines_analysis(value: str | None) -> bool:
    if value is None:
        return False

    normalized = value.strip().lower()
    return normalized in {"khong", "không", "khÃ´ng", "no", "n", "false", "0"}


def build_graph():
    memory = MemorySaver()

    agent_check_inp = agent_check_inputs()
    agent_rag = agent_recommend_via_rags()
    agent_ana = agent_analytical_ad_dis()

    def check_input_node(state: dict[str, Any]) -> dict[str, Any]:
        result = agent_check_inp.invoke({"input": state["question"]})
        return {
            "check_inp": result["output"],
            "dif": state.get("dif", ""),
        }

    def recommend_node(state: dict[str, Any]) -> dict[str, Any]:
        text = state["check_inp"].lower()

        if any(key not in text for key in ["name", "age", "gender", "area"]):
            return {
                "check_inp": state["check_inp"],
                "recommend_rag": "no rag",
                "dif": state.get("dif", ""),
            }

        result = agent_rag.invoke({"input": state["check_inp"]})
        return {
            "check_inp": state["check_inp"],
            "recommend_rag": result["output"],
            "dif": state.get("dif", ""),
        }

    def route_after_recommend(state: dict[str, Any]):
        if _wants_analysis(state.get("dif")):
            return "analysis"
        return END

    def analysis_node(state: dict[str, Any]) -> dict[str, Any]:
        result = agent_ana.invoke({"input": state["recommend_rag"]})
        return {"ana": result["output"]}

    graph = StateGraph(dict)
    graph.add_node("check_input", check_input_node)
    graph.add_node("recommend", recommend_node)
    graph.add_node("analysis", analysis_node)

    graph.set_entry_point("check_input")
    graph.add_edge("check_input", "recommend")
    graph.add_conditional_edges(
        "recommend",
        route_after_recommend,
        {"analysis": "analysis", END: END},
    )

    return graph.compile(checkpointer=memory)


app = FastAPI(title="Medical RAG API", version="1.1.0")
graph_store = GraphSessionStore()
conversation_store = ConversationSessionStore()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root() -> dict[str, str]:
    return {"message": "Medical RAG API is running"}


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest) -> ChatResponse:
    try:
        app_graph = graph_store.get(request.thread_id)
        config = {"configurable": {"thread_id": request.thread_id}}
        session = conversation_store.get(request.thread_id)

        if request.dif is not None:
            if not session.get("awaiting_analysis"):
                raise HTTPException(
                    status_code=400,
                    detail="Khong co yeu cau phan tich nao dang cho o thread_id nay.",
                )

            if _wants_analysis(request.dif):
                last_question = session.get("last_question")
                if not last_question:
                    raise HTTPException(
                        status_code=400,
                        detail="Khong tim thay cau hoi truoc do de phan tich tiep.",
                    )

                final_result = app_graph.invoke(
                    {"question": last_question, "dif": request.dif},
                    config=config,
                )
                conversation_store.update(request.thread_id, awaiting_analysis=False)
                return ChatResponse(
                    thread_id=request.thread_id,
                    question=last_question,
                    status="answered_with_analysis",
                    answer=final_result.get("ana", session.get("last_recommend_rag", "")),
                    check_inp=session.get("last_check_inp"),
                    recommend_rag=session.get("last_recommend_rag"),
                    analysis=final_result.get("ana"),
                )

            if _declines_analysis(request.dif):
                conversation_store.update(request.thread_id, awaiting_analysis=False)
                return ChatResponse(
                    thread_id=request.thread_id,
                    question=session.get("last_question"),
                    status="analysis_skipped",
                    answer=session.get("last_recommend_rag", ""),
                    check_inp=session.get("last_check_inp"),
                    recommend_rag=session.get("last_recommend_rag"),
                )

            raise HTTPException(
                status_code=400,
                detail="Gia tri dif khong hop le. Hay gui co/khong.",
            )

        if not request.question or not request.question.strip():
            raise HTTPException(
                status_code=400,
                detail="Can gui question o lan hoi dau tien.",
            )

        first_result = app_graph.invoke({"question": request.question}, config=config)

        if first_result["recommend_rag"] == "no rag":
            conversation_store.update(
                request.thread_id,
                last_question=request.question,
                last_check_inp=first_result["check_inp"],
                last_recommend_rag=None,
                awaiting_analysis=False,
            )
            return ChatResponse(
                thread_id=request.thread_id,
                question=request.question,
                status="need_more_info",
                answer=first_result["check_inp"],
                check_inp=first_result["check_inp"],
                recommend_rag=first_result["recommend_rag"],
            )

        conversation_store.update(
            request.thread_id,
            last_question=request.question,
            last_check_inp=first_result["check_inp"],
            last_recommend_rag=first_result["recommend_rag"],
            awaiting_analysis=True,
        )
        return ChatResponse(
            thread_id=request.thread_id,
            question=request.question,
            status="answered",
            answer=first_result["recommend_rag"],
            check_inp=first_result["check_inp"],
            recommend_rag=first_result["recommend_rag"],
            ask_for_analysis=True,
            analysis_prompt="Bạn có muốn phân tích ưu/nhược của các phương pháp này không?",
        )
    except Exception as exc:
        if isinstance(exc, HTTPException):
            raise
        raise HTTPException(status_code=500, detail=str(exc)) from exc


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("api:app", host="0.0.0.0", port=8001, reload=False)
