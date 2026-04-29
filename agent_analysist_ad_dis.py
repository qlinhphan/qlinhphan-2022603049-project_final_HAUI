from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
load_dotenv()
import os 
from pprint import pprint 
from langchain_core.messages import HumanMessage
from langchain_core.tools import tool
from langchain_openai import ChatOpenAI
from langchain.agents import create_agent
from langchain_classic.agents import AgentExecutor, create_openai_tools_agent
from langgraph.checkpoint.memory import MemorySaver
from langchain_classic.prompts import ChatPromptTemplate
from langchain_classic.memory import ConversationBufferMemory

# categories = ['Glioma', 'Meningioma', 'Pituitary tumor'] 
# adventage, disadventage
# dùng thuốc, phẫu thuật, theo dõi, xạ trị, hóa trị, tiêm thuốc

@tool
def UuDiemVaNhuocDiemCuaCacPhuongPhapDieuTriTool(sentence : str):

    """Dùng để phân tích ưu điểm, nhược điểm của các phương pháp dùng thuốc, phẫu thuật, theo dõi, xạ trị, hóa trị, tiêm thuốc 
    khi bệnh nhân mắc các khối u Glioma, Meningioma, Pituitary tumor
    """

    print("===[[[TOOL FIND ADVENTAGES AND DISADVENTAGES]]]===")

    response = []

    #======================================================================Glioma
    if sentence.lower().__contains__('dùng thuốc') and sentence.lower().__contains__('glioma'):
        llm = ChatOpenAI(model="gpt-4o-mini", base_url=os.getenv("BASE_URL"))
        tool = {"type": "web_search_preview"}
        llm_with_tools = llm.bind_tools([tool])
        response_ad = llm_with_tools.invoke("Ưu điểm của phương pháp dùng thuốc khi mắc khối u glioma?")
        response_dis = llm_with_tools.invoke("Nhược điểm của phương pháp dùng thuốc khi mắc khối u glioma?")
        response.append(response_ad.content[0]['text'])
        response.append(response_dis.content[0]['text'])

    if sentence.lower().__contains__('phẫu thuật') and sentence.lower().__contains__('glioma'):
        llm = ChatOpenAI(model="gpt-4o-mini", base_url=os.getenv("BASE_URL"))
        tool = {"type": "web_search_preview"}
        llm_with_tools = llm.bind_tools([tool])
        response_ad = llm_with_tools.invoke("Ưu điểm của phương pháp phẫu thuật khi mắc khối u glioma?")
        response_dis = llm_with_tools.invoke("Nhược điểm của phương pháp phẫu thuật khi mắc khối u glioma?")
        response.append(response_ad.content[0]['text'])
        response.append(response_dis.content[0]['text'])

    if sentence.lower().__contains__('theo dõi') and sentence.lower().__contains__('glioma'):
        llm = ChatOpenAI(model="gpt-4o-mini", base_url=os.getenv("BASE_URL"))
        tool = {"type": "web_search_preview"}
        llm_with_tools = llm.bind_tools([tool])
        response_ad = llm_with_tools.invoke("Ưu điểm của phương pháp theo dõi khi mắc khối u glioma?")
        response_dis = llm_with_tools.invoke("Nhược điểm của phương pháp theo dõi khi mắc khối u glioma?")
        response.append(response_ad.content[0]['text'])
        response.append(response_dis.content[0]['text'])

    if sentence.lower().__contains__('xạ trị') and sentence.lower().__contains__('glioma'):
        llm = ChatOpenAI(model="gpt-4o-mini", base_url=os.getenv("BASE_URL"))
        tool = {"type": "web_search_preview"}
        llm_with_tools = llm.bind_tools([tool])
        response_ad = llm_with_tools.invoke("Ưu điểm của phương pháp xạ trị khi mắc khối u glioma?")
        response_dis = llm_with_tools.invoke("Nhược điểm của phương pháp xạ trị khi mắc khối u glioma?")
        response.append(response_ad.content[0]['text'])
        response.append(response_dis.content[0]['text'])

    if sentence.lower().__contains__('hóa trị') and sentence.lower().__contains__('glioma'):
        llm = ChatOpenAI(model="gpt-4o-mini", base_url=os.getenv("BASE_URL"))
        tool = {"type": "web_search_preview"}
        llm_with_tools = llm.bind_tools([tool])
        response_ad = llm_with_tools.invoke("Ưu điểm của phương pháp hóa trị khi mắc khối u glioma?")
        response_dis = llm_with_tools.invoke("Nhược điểm của phương pháp hóa trị khi mắc khối u glioma?")
        response.append(response_ad.content[0]['text'])
        response.append(response_dis.content[0]['text'])

    if sentence.lower().__contains__('tiêm thuốc') and sentence.lower().__contains__('glioma'):
        llm = ChatOpenAI(model="gpt-4o-mini", base_url=os.getenv("BASE_URL"))
        tool = {"type": "web_search_preview"}
        llm_with_tools = llm.bind_tools([tool])
        response_ad = llm_with_tools.invoke("Ưu điểm của phương pháp tiêm thuốc khi mắc khối u glioma?")
        response_dis = llm_with_tools.invoke("Nhược điểm của phương pháp tiêm thuốc khi mắc khối u glioma?")
        response.append(response_ad.content[0]['text'])
        response.append(response_dis.content[0]['text'])

    #======================================================================Meningioma
    if sentence.lower().__contains__('dùng thuốc') and sentence.lower().__contains__('meningioma'):
        llm = ChatOpenAI(model="gpt-4o-mini", base_url=os.getenv("BASE_URL"))
        tool = {"type": "web_search_preview"}
        llm_with_tools = llm.bind_tools([tool])
        response_ad = llm_with_tools.invoke("Ưu điểm của phương pháp dùng thuốc khi mắc khối u meningioma?")
        response_dis = llm_with_tools.invoke("Nhược điểm của phương pháp dùng thuốc khi mắc khối u meningioma?")
        response.append(response_ad.content[0]['text'])
        response.append(response_dis.content[0]['text'])

    if sentence.lower().__contains__('phẫu thuật') and sentence.lower().__contains__('meningioma'):
        llm = ChatOpenAI(model="gpt-4o-mini", base_url=os.getenv("BASE_URL"))
        tool = {"type": "web_search_preview"}
        llm_with_tools = llm.bind_tools([tool])
        response_ad = llm_with_tools.invoke("Ưu điểm của phương pháp phẫu thuật khi mắc khối u meningioma?")
        response_dis = llm_with_tools.invoke("Nhược điểm của phương pháp phẫu thuật khi mắc khối u meningioma?")
        response.append(response_ad.content[0]['text'])
        response.append(response_dis.content[0]['text'])

    if sentence.lower().__contains__('theo dõi') and sentence.lower().__contains__('meningioma'):
        llm = ChatOpenAI(model="gpt-4o-mini", base_url=os.getenv("BASE_URL"))
        tool = {"type": "web_search_preview"}
        llm_with_tools = llm.bind_tools([tool])
        response_ad = llm_with_tools.invoke("Ưu điểm của phương pháp theo dõi khi mắc khối u meningioma?")
        response_dis = llm_with_tools.invoke("Nhược điểm của phương pháp theo dõi khi mắc khối u meningioma?")
        response.append(response_ad.content[0]['text'])
        response.append(response_dis.content[0]['text'])

    if sentence.lower().__contains__('xạ trị') and sentence.lower().__contains__('meningioma'):
        llm = ChatOpenAI(model="gpt-4o-mini", base_url=os.getenv("BASE_URL"))
        tool = {"type": "web_search_preview"}
        llm_with_tools = llm.bind_tools([tool])
        response_ad = llm_with_tools.invoke("Ưu điểm của phương pháp xạ trị khi mắc khối u meningioma?")
        response_dis = llm_with_tools.invoke("Nhược điểm của phương pháp xạ trị khi mắc khối u meningioma?")
        response.append(response_ad.content[0]['text'])
        response.append(response_dis.content[0]['text'])

    if sentence.lower().__contains__('hóa trị') and sentence.lower().__contains__('meningioma'):
        llm = ChatOpenAI(model="gpt-4o-mini", base_url=os.getenv("BASE_URL"))
        tool = {"type": "web_search_preview"}
        llm_with_tools = llm.bind_tools([tool])
        response_ad = llm_with_tools.invoke("Ưu điểm của phương pháp hóa trị khi mắc khối u meningioma?")
        response_dis = llm_with_tools.invoke("Nhược điểm của phương pháp hóa trị khi mắc khối u meningioma?")
        response.append(response_ad.content[0]['text'])
        response.append(response_dis.content[0]['text'])

    if sentence.lower().__contains__('tiêm thuốc') and sentence.lower().__contains__('meningioma'):
        llm = ChatOpenAI(model="gpt-4o-mini", base_url=os.getenv("BASE_URL"))
        tool = {"type": "web_search_preview"}
        llm_with_tools = llm.bind_tools([tool])
        response_ad = llm_with_tools.invoke("Ưu điểm của phương pháp tiêm thuốc khi mắc khối u meningioma?")
        response_dis = llm_with_tools.invoke("Nhược điểm của phương pháp tiêm thuốc khi mắc khối u meningioma?")
        response.append(response_ad.content[0]['text'])
        response.append(response_dis.content[0]['text'])

    #======================================================================Pituitary tumor
    if sentence.lower().__contains__('dùng thuốc') and sentence.lower().__contains__('pituitary tumor'):
        llm = ChatOpenAI(model="gpt-4o-mini", base_url=os.getenv("BASE_URL"))
        tool = {"type": "web_search_preview"}
        llm_with_tools = llm.bind_tools([tool])
        response_ad = llm_with_tools.invoke("Ưu điểm của phương pháp dùng thuốc khi mắc khối u pituitary tumor?")
        response_dis = llm_with_tools.invoke("Nhược điểm của phương pháp dùng thuốc khi mắc khối u pituitary tumor?")
        response.append(response_ad.content[0]['text'])
        response.append(response_dis.content[0]['text'])

    if sentence.lower().__contains__('phẫu thuật') and sentence.lower().__contains__('pituitary tumor'):
        llm = ChatOpenAI(model="gpt-4o-mini", base_url=os.getenv("BASE_URL"))
        tool = {"type": "web_search_preview"}
        llm_with_tools = llm.bind_tools([tool])
        response_ad = llm_with_tools.invoke("Ưu điểm của phương pháp phẫu thuật khi mắc khối u pituitary tumor?")
        response_dis = llm_with_tools.invoke("Nhược điểm của phương pháp phẫu thuật khi mắc khối u pituitary tumor?")
        response.append(response_ad.content[0]['text'])
        response.append(response_dis.content[0]['text'])

    if sentence.lower().__contains__('theo dõi') and sentence.lower().__contains__('pituitary tumor'):
        llm = ChatOpenAI(model="gpt-4o-mini", base_url=os.getenv("BASE_URL"))
        tool = {"type": "web_search_preview"}
        llm_with_tools = llm.bind_tools([tool])
        response_ad = llm_with_tools.invoke("Ưu điểm của phương pháp theo dõi khi mắc khối u pituitary tumor?")
        response_dis = llm_with_tools.invoke("Nhược điểm của phương pháp theo dõi khi mắc khối u pituitary tumor?")
        response.append(response_ad.content[0]['text'])
        response.append(response_dis.content[0]['text'])

    if sentence.lower().__contains__('xạ trị') and sentence.lower().__contains__('pituitary tumor'):
        llm = ChatOpenAI(model="gpt-4o-mini", base_url=os.getenv("BASE_URL"))
        tool = {"type": "web_search_preview"}
        llm_with_tools = llm.bind_tools([tool])
        response_ad = llm_with_tools.invoke("Ưu điểm của phương pháp xạ trị khi mắc khối u pituitary tumor?")
        response_dis = llm_with_tools.invoke("Nhược điểm của phương pháp xạ trị khi mắc khối u pituitary tumor?")
        response.append(response_ad.content[0]['text'])
        response.append(response_dis.content[0]['text'])

    if sentence.lower().__contains__('hóa trị') and sentence.lower().__contains__('pituitary tumor'):
        llm = ChatOpenAI(model="gpt-4o-mini", base_url=os.getenv("BASE_URL"))
        tool = {"type": "web_search_preview"}
        llm_with_tools = llm.bind_tools([tool])
        response_ad = llm_with_tools.invoke("Ưu điểm của phương pháp hóa trị khi mắc khối u pituitary tumor?")
        response_dis = llm_with_tools.invoke("Nhược điểm của phương pháp hóa trị khi mắc khối u pituitary tumor?")
        response.append(response_ad.content[0]['text'])
        response.append(response_dis.content[0]['text'])

    if sentence.lower().__contains__('tiêm thuốc') and sentence.lower().__contains__('pituitary tumor'):
        llm = ChatOpenAI(model="gpt-4o-mini", base_url=os.getenv("BASE_URL"))
        tool = {"type": "web_search_preview"}
        llm_with_tools = llm.bind_tools([tool])
        response_ad = llm_with_tools.invoke("Ưu điểm của phương pháp tiêm thuốc khi mắc khối u pituitary tumor?")
        response_dis = llm_with_tools.invoke("Nhược điểm của phương pháp tiêm thuốc khi mắc khối u pituitary tumor?")
        response.append(response_ad.content[0]['text'])
        response.append(response_dis.content[0]['text'])

    return response


prompt = ChatPromptTemplate.from_messages([
    ("system", """
    Bạn là trợ ảo AI trong y tế, chuyên phân tích các ưu điểm, nhược điểm của các phương pháp dùng thuốc, phẫu thuật, theo dõi, xạ trị, hóa trị, tiêm thuốc khi bác sĩ đưa vào thông tin người bệnh mắc các khối u Glioma, Meningioma, Pituitary tumor
    NHIỆM VỤ:
     - phân tích các ưu điểm, nhược điểm của các phương pháp dùng thuốc, phẫu thuật, theo dõi, xạ trị, hóa trị, tiêm thuốc khi bác sĩ đưa vào thông tin người bệnh mắc các khối u Glioma, Meningioma, Pituitary tumor
     - DIỄN ĐẠT KHOA HỌC, DỄ HIỂU
    QUY TẮC:
     - CHỈ TRẢ LỜI NHỮNG CÂU MANG TÍNH Y TẾ VÀ CÓ TRONG TOOL.
"""),
    ("placeholder", "{chat_history}"),
    ("user", "{input}"),
    ("placeholder", "{agent_scratchpad}")
])

def agent_analytical_ad_dis():
    memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)

    llm = ChatOpenAI(model="gpt-4o-mini", base_url=os.getenv("BASE_URL"))
    agent = create_openai_tools_agent(llm, [UuDiemVaNhuocDiemCuaCacPhuongPhapDieuTriTool], prompt)
    agentExe = AgentExecutor(agent=agent, tools=[UuDiemVaNhuocDiemCuaCacPhuongPhapDieuTriTool], memory=memory)
    return agentExe

# while True:
#     ques = input("BAN: ")

#     if ques == "bye":
#         print("bye ok!")
#         break

#     rs = agentExe.invoke({"input": ques})

#     print("AI ASS: ", rs['output'])


# python agent_analysist_ad_dis.py