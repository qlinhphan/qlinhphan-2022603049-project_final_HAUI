import faiss
from connect_mg import get_collection
from langchain_openai import OpenAIEmbeddings
from dotenv import load_dotenv
load_dotenv()
import os
embeddings = OpenAIEmbeddings(model="text-embedding-3-small", base_url=os.getenv("BASE_URL"))
import numpy as np

def ragOK(question):
    embbed = np.array([embeddings.embed_query(question)], dtype=np.float32)
    print(embbed.shape)
    faiss.normalize_L2(embbed)

    fai = faiss.read_index("faiss.index")

    d, i = fai.search(embbed, k = 10)

    db = get_collection()
    all_data_db = list(db.find())

    # print(all_data_db)
    data_text_db = [a['text'] for a in all_data_db]

    i_need = i[0]
    print(i_need)

    text_need_find = [data_text_db[i] for i in i_need]

    return text_need_find
    

question = "bệnh nhân nam, 47 tuổi, mắc glioma"
ragOK(question=question)