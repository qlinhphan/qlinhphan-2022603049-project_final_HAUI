
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
def toolCheckName(name: str):
    """Kiểm tra tool khối u là hợp lệ"""
    print("===[[[TOOL CHECK NAME]]]===")
    name_ok = ['glioma', 'meningioma', 'pituitary Tumor']

    if  name.lower().__contains__('glioma') or name.lower().__contains__('meningioma') or name.lower().__contains__('pituitary tumor'):
        return {
            "check": 'Tên khối u hợp lệ'
        }
    else:
        return {
            "check": "Tên khối u không hợp lệ"
        }
    
@tool 
def toolCheckGender(gender: str):
    """Kiểm tra tool khối u là hợp lệ"""
    print("===[[[TOOL CHECK GENDER]]]===")
    gender_ok = ['nam', 'nữ']

    if gender.lower().__contains__('nam') or gender.lower().__contains__('nữ'):
        return {
            "check": 'Giới tính hợp lệ'
        }
    else:
        return {
            "check": "giới tính không hợp lệ"
        }


def agent_check_inputs():
    prompt = ChatPromptTemplate.from_messages([
    ("system", """
Bạn là trợ lý AI y tế chuyên hỗ trợ bác sĩ trong việc đưa ra hướng điều trị cho bệnh nhân dựa vào các thông tin name(tên khối u), area(diện tích khối u, số điểm ảnh), age(tuổi bệnh nhân) và gender(giới tính bệnh nhân) mà bác sĩ đưa vào
NHIỆM VỤ
     - Trích xuất ra 4 đặc trưng quan trọng tên khối u, diện tích khối u-số điểm ảnh, tuổi bệnh nhân và giới tính bệnh nhân.
     - PHẢI DÙNG TOOL ĐỂ CHECK TÊN KHỐI U VÀ GIỚI TÍNH BỆNH NHÂN
QUY TẮC
     - PHẢI TRÍCH XUẤT ĐẦY ĐỦ 4 ĐẶC TRƯNG tên khối u, diện tích khối u-số điểm ảnh, tuổi bệnh nhân và giới tính bệnh nhân.
     - Nếu ĐẶC TRƯNG NÀO THIẾU THÌ HỎI ĐẶC TRƯNG ĐÓ
     - KHÔNG TỰ BỊA BẤT KỲ THÔNG TIN NÀO
     - KHI TRÍCH XUẤT ĐẦY ĐỦ 4 THÔNG TIN VỀ TRẢ VỀ JSON CÓ DẠNG:
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

    agent = create_openai_tools_agent(llm, [toolCheckGender, toolCheckName], prompt)

    agent_exe = AgentExecutor(agent = agent, tools = [toolCheckGender, toolCheckName], memory=memory)

    return agent_exe

# agent = agent_check_inputs()
# user_input = input("Ban la ai?")
# rs = agent.invoke({"input": user_input})
# print(rs['output'])


# while True:
#     user_input = input("Bạn: ")

#     rs = agent.invoke({"input": user_input})

#     print("AI ASSISTANT: ", rs['output'])



# python agent_check_input.py



