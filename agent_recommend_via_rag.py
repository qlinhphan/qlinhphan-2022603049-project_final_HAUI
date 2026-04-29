import os
from dotenv import load_dotenv
from langchain_core.messages import HumanMessage
from langchain_core.tools import tool
from langchain_openai import ChatOpenAI
from langchain.agents import create_agent
from langchain_classic.agents import AgentExecutor, create_openai_tools_agent
from langgraph.checkpoint.memory import MemorySaver
from langchain_classic.prompts import ChatPromptTemplate
from langchain_classic.memory import ConversationBufferMemory
load_dotenv()
import numpy as np
import faiss
from connect_mg import get_collection
from langchain_openai import OpenAIEmbeddings
embeddings = OpenAIEmbeddings(model="text-embedding-3-small", base_url=os.getenv("BASE_URL"))
import numpy as np
from rag import ragOK

# print(embeddings.embed_query("hello"))


@tool
def toolRagOk(question: str):
    """tool dùng để truy vấn dữ liệu"""
    text_need_find = ragOK(question=question)
    print("===[[[TOOL RECOMMENDED <RAG>]]]===")
    return text_need_find

def agent_recommend_via_rags():
    prompt = ChatPromptTemplate.from_messages([
    ("system", """
Bạn là trợ lý AI y tế chuyên hỗ trợ bác sĩ trong việc đưa ra hướng điều trị dựa vào tool
NHIỆM VỤ
     - KHI BẠN NHẬN ĐƯỢC ĐẦU ĐỦ CÁC THÔNG TIN name(tên khối u), area(diện tích khối u, số điểm ảnh), age(tuổi bệnh nhân) và gender(giới tính bệnh nhân) thì PHẢI DỰA VÀO TOOL ĐỂ ĐƯA RA HƯỚNG ĐIỀU TRỊ
     - DIỄN ĐẠT ĐẦY ĐỦ, DỄ HIỂU, THÂN THIỆN
QUY TẮC
     - PHẢI TRÌNH BÀY ĐẦY ĐỦ CÁC PHƯƠNG PHÁP CÓ TRONG TOOL
     - KHÔNG BỊA, KHÔNG NÓI NHỮNG THỨ KHÔNG LIÊN QUAN
"""),
    ("placeholder", "{chat_history}"),
    ("user", "{input}"),
    ("placeholder", "{agent_scratchpad}")
])

    llm = ChatOpenAI(model = 'gpt-4o-mini', base_url=os.getenv("BASE_URL"))

    memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)

    agent = create_openai_tools_agent(llm, [toolRagOk], prompt)

    agent_exe = AgentExecutor(agent = agent, tools = [toolRagOk], memory=memory)
    return agent_exe

# while True:
#     user_input = input("Bạn: ")
#     agent_exe = agent_recommend_via_rags()

#     rs = agent_exe.invoke({"input": user_input})

#     print("AI ASSISTANT: ", rs['output'])

# python agent_recommend_via_rag.py


