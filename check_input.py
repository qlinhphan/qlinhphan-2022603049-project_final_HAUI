from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_classic.memory import ConversationBufferMemory
from dotenv import load_dotenv
load_dotenv()
import os

def checkInput():

    llm = ChatOpenAI(model = os.getenv('MODEL_CHAT'), temperature=0)

    memory = ConversationBufferMemory(
        memory_key="chat_history",
        return_messages=True
    )

    prompt = ChatPromptTemplate.from_messages([
    ("system", """
Bạn là hệ thống trích xuất thông tin bệnh nhân.

Hãy trích xuất các trường sau:
- age (tuổi)
- area (diện tích, số)
- type (loại u)
- sex (giới tính)

Quy tắc:
- Nếu thiếu thông tin thì để null
- CHỈ HỎI LẠI KHI bác sĩ đưa thiếu thông tin về age, area, type, sex
- PHẢI TRẢ VỀ DẠNG JSON đúng format sau KHI ĐÃ ĐỦ THÔNG TIN:

{{
  "age": null,
  "area": null,
  "type": null,
  "sex": null
}} 
"""),
    ("placeholder", "{chat_history}"),  # 🔥 chỗ memory inject vào
    ("human", "{input}"),
    ])
    
    chain = prompt | llm

    while True:
        user_input = input("BẠN: ")

        response = chain.invoke({
        "input": user_input,
        "chat_history": memory.load_memory_variables({})["chat_history"]
        })

        # lưu lại vào memory
        memory.save_context(
            {"input": user_input},
            {"output": response.content}
        )

        return response.content