from __future__ import annotations

import inspect
import os
import socket
from contextlib import asynccontextmanager
from threading import Lock
from typing import Any

from starlette.routing import Router as StarletteRouter


def _patch_starlette_router_for_fastapi() -> None:
    """Compat for environments with FastAPI + Starlette 1.0."""
    if "on_startup" in inspect.signature(StarletteRouter.__init__).parameters:
        return

    original_init = StarletteRouter.__init__

    @asynccontextmanager
    async def _legacy_lifespan(app, on_startup, on_shutdown):
        for handler in on_startup or []:
            result = handler()
            if inspect.isawaitable(result):
                await result
        try:
            yield
        finally:
            for handler in on_shutdown or []:
                result = handler()
                if inspect.isawaitable(result):
                    await result

    def patched_init(
        self,
        routes=None,
        redirect_slashes: bool = True,
        default=None,
        on_startup=None,
        on_shutdown=None,
        lifespan=None,
        *,
        middleware=None,
    ):
        if lifespan is None and (on_startup or on_shutdown):
            lifespan = lambda app: _legacy_lifespan(app, on_startup, on_shutdown)
        return original_init(
            self,
            routes=routes,
            redirect_slashes=redirect_slashes,
            default=default,
            lifespan=lifespan,
            middleware=middleware,
        )

    StarletteRouter.__init__ = patched_init


_patch_starlette_router_for_fastapi()

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
        description="Mo ta thong tin benh nhan cho luot hoi dau tien.",
    )
    thread_id: str = Field(default="default", description="Ma phien hoi thoai")
    rep: str | None = Field(
        default=None,
        description="Cau tra loi co/khong khi hoi co muon phan tich them hay khong.",
    )
    dif: str | None = Field(
        default=None,
        description="Ten truong cu, duoc giu lai de tuong thich voi client dang dung dif.",
    )


class ChatResponse(BaseModel):
    thread_id: str
    question: str | None = None
    status: str
    answer: str
    check: str | None = None
    recom: str | None = None
    ana: str | None = None
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
            return dict(self._sessions.get(thread_id, {}))

    def update(self, thread_id: str, **values: Any) -> None:
        with self._lock:
            session = self._sessions.setdefault(thread_id, {})
            session.update(values)


def _wants_analysis(value: str | None) -> bool:
    if value is None:
        return False

    normalized = value.strip().lower()
    return normalized in {"co", "có", "cÃ³", "yes", "y", "true", "1"} or "có" in normalized or "co" in normalized


def _declines_analysis(value: str | None) -> bool:
    if value is None:
        return False

    normalized = value.strip().lower()
    return normalized in {"khong", "không", "khÃ´ng", "no", "n", "false", "0"} or "không" in normalized or "khong" in normalized


def _has_required_fields(text: str) -> bool:
    lowered = text.lower()
    return all(key in lowered for key in ["name", "age", "gender", "area"])


def build_graph():
    memory = MemorySaver()

    agent_check = agent_check_inputs()
    agent_recommend = agent_recommend_via_rags()
    agent_ana = agent_analytical_ad_dis()

    def check_node(state: dict[str, Any]) -> dict[str, Any]:
        if "check" in state:
            return state

        result = agent_check.invoke({"input": state["ques"]})
        return {"check": result["output"]}

    def recommend_node(state: dict[str, Any]) -> dict[str, Any]:
        if "recom" in state:
            return state

        result = agent_recommend.invoke({"input": state["check"]})
        return {
            "check": state["check"],
            "recom": result["output"],
        }

    def route_recommend(state: dict[str, Any]):
        if _has_required_fields(state["check"]):
            return "r"
        return END

    def analysis_node(state: dict[str, Any]) -> dict[str, Any]:
        result = agent_ana.invoke({"input": state["recom"]})
        return {
            "check": state["check"],
            "recom": state["recom"],
            "ana": result["output"],
        }

    def route_analysis(state: dict[str, Any]):
        if _wants_analysis(state.get("rep")):
            return "a"
        return END

    graph = StateGraph(dict)
    graph.add_node("c", check_node)
    graph.add_node("r", recommend_node)
    graph.add_node("a", analysis_node)

    graph.set_entry_point("c")
    graph.add_conditional_edges(
        "c",
        route_recommend,
        {"r": "r", END: END},
    )
    graph.add_conditional_edges(
        "r",
        route_analysis,
        {"a": "a", END: END},
    )

    return graph.compile(checkpointer=memory)


def _pick_available_port(preferred_port: int, max_attempts: int = 10) -> int:
    for port in range(preferred_port, preferred_port + max_attempts):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            if sock.connect_ex(("127.0.0.1", port)) != 0:
                return port

    raise RuntimeError(
        f"Khong tim duoc cong trong trong khoang {preferred_port}-{preferred_port + max_attempts - 1}."
    )


app = FastAPI(title="Medical RAG API Different", version="1.0.0")
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
    return {"message": "Medical RAG API Different is running"}


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest) -> ChatResponse:
    try:
        app_graph = graph_store.get(request.thread_id)
        config = {"configurable": {"thread_id": request.thread_id}}
        session = conversation_store.get(request.thread_id)
        analysis_reply = request.rep if request.rep is not None else request.dif

        if analysis_reply is not None:
            if not session.get("awaiting_analysis"):
                raise HTTPException(
                    status_code=400,
                    detail="Khong co yeu cau phan tich nao dang cho o thread_id nay.",
                )

            last_question = session.get("last_question")
            last_check = session.get("last_check")
            last_recom = session.get("last_recom")
            if not last_question or not last_check or not last_recom:
                raise HTTPException(
                    status_code=400,
                    detail="Khong tim thay du lieu truoc do de tiep tuc phan tich.",
                )

            result = app_graph.invoke(
                {
                    "ques": last_question,
                    "rep": analysis_reply,
                    "check": last_check,
                    "recom": last_recom,
                },
                config=config,
            )

            conversation_store.update(request.thread_id, awaiting_analysis=False)

            if "ana" in result:
                return ChatResponse(
                    thread_id=request.thread_id,
                    question=last_question,
                    status="answered_with_analysis",
                    answer=result["ana"],
                    check=result.get("check"),
                    recom=result.get("recom"),
                    ana=result.get("ana"),
                )

            if not _declines_analysis(analysis_reply):
                raise HTTPException(
                    status_code=400,
                    detail="Gia tri rep/dif khong hop le. Hay gui co/khong.",
                )

            return ChatResponse(
                thread_id=request.thread_id,
                question=last_question,
                status="analysis_skipped",
                answer=last_recom,
                check=last_check,
                recom=last_recom,
            )

        if not request.question or not request.question.strip():
            raise HTTPException(
                status_code=400,
                detail="Cần gửi req ở lần hỏi đầu tiên.",
            )

        result = app_graph.invoke({"ques": request.question}, config=config)

        if "recom" not in result:
            conversation_store.update(
                request.thread_id,
                last_question=request.question,
                last_check=result.get("check"),
                last_recom=None,
                awaiting_analysis=False,
            )
            return ChatResponse(
                thread_id=request.thread_id,
                question=request.question,
                status="need_more_info",
                answer=result["check"],
                check=result.get("check"),
            )

        conversation_store.update(
            request.thread_id,
            last_question=request.question,
            last_check=result.get("check"),
            last_recom=result.get("recom"),
            awaiting_analysis=True,
        )
        return ChatResponse(
            thread_id=request.thread_id,
            question=request.question,
            status="answered",
            answer=result["recom"],
            check=result.get("check"),
            recom=result.get("recom"),
            ask_for_analysis=True,
            analysis_prompt="Bạn có muốn phân tich ưu điểm, nhược điểm của các phương pháp này không? (có/không)",
        )
    except Exception as exc:
        if isinstance(exc, HTTPException):
            raise
        raise HTTPException(status_code=500, detail=str(exc)) from exc


if __name__ == "__main__":
    import uvicorn

    preferred_port = int(os.getenv("API_DIFFERENT_PORT", "8002"))
    port = _pick_available_port(preferred_port)

    if port != preferred_port:
        print(f"Port {preferred_port} dang duoc su dung, chuyen sang port {port}.")

    uvicorn.run("api_different:app", host="0.0.0.0", port=port, reload=False)

# python api_different.py
