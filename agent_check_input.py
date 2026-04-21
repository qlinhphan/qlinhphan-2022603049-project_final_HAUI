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

@tool
def toolValidInp(name: str, gender: str):
    """kiểm tra xem tên khối u và giới tính bệnh nhân có hợp lệ"""
    gender_ok = ['nam', 'nữ']
    name_ok = ['glioma', 'vis', 'lis']

    return {
        "name": name in name_ok,
        "gender": gender in gender_ok,
    }

    # data = {
    #     "name": None,
    #     "area": None,
    #     "age": None,
    #     "gender": None
    # }

    # for go in gender_ok:
    #     if express.lower().__contains__(go):
    #         data['gender'] = go

    # for no in name_ok:
    #     if express.lower().__contains__(no):
    #         data['name'] = no

    # print("[TOOL CHECK INPUT...]")

    # return data 

def agent_check_inputs():
    prompt = ChatPromptTemplate.from_messages([
    ("system", """
Bạn là trợ lý AI y tế chuyên hỗ trợ bác sĩ trong việc đưa ra hướng điều trị cho bệnh nhân dựa vào các thông tin name(tên khối u), area(diện tích khối u, số điểm ảnh), age(tuổi bệnh nhân) và gender(giới tính bệnh nhân) mà bác sĩ đưa vào
NHIỆM VỤ
     - Trích xuất ra 4 đặc trưng quan trọng name(tên khối u), area(diện tích khối u, số điểm ảnh), age(tuổi bệnh nhân) và gender(giới tính bệnh nhân).
QUY TẮC
     - PHẢI TRÍCH XUẤT ĐẦY ĐỦ 4 ĐẶC TRƯNG NAME, AREA, AGE, GENDER và DÙNG TOOL NẾU CẦN
     - THIÊU 1 TRONG 4 ĐẶC TRƯNG THÌ PHẢI HỎI LẠI BÁC SĨ CHO ĐẾN KHI ĐẦY ĐỦ, Nếu ĐẶC TRƯNG NÀO THIẾU THÌ HỎI ĐẶC TRƯNG ĐÓ
     - TÊN KHỐI U PHẢI LÀ 1 TRONG 3 'glioma', 'vis', 'lis'
     - KHI TRÍCH XUẤT ĐẦY ĐỦ 4 THÔNG TIN VỀ TRẢ VỀ JSON CÓ DẠNG
     {{
        "name": "...",
        "area": "...",
        "age": "...",
        "gender": "..."
     }}
"""),
    ("placeholder", "{chat_history}"),
    ("user", "{input}"),
    ("placeholder", "{agent_scratchpad}")
])

    llm = ChatOpenAI(model = 'gpt-4o-mini', base_url=os.getenv("BASE_URL"))

    memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)

    agent = create_openai_tools_agent(llm, [toolValidInp], prompt)

    agent_exe = AgentExecutor(agent = agent, tools = [toolValidInp], memory=memory)

    return agent_exe

# agent = agent_check_inputs()
# user_input = input("Ban la ai?")
# rs = agent.invoke({"input": user_input})
# print(rs['output'])


# while True:
#     user_input = input("Bạn: ")

#     rs = agent_exe.invoke({"input": user_input})

#     print("AI ASSISTANT: ", rs['output'])



# python agent_check_input.py

