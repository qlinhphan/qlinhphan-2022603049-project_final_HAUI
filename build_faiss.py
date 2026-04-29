import faiss
from connect_mg import get_collection
import numpy as np


def buildFAISS():
    collect = get_collection()
    data_in_db = list(collect.find())
    # print(data_in_db[0]['text'])

    emb_in_db = np.array([d['embedding'] for d in data_in_db], dtype=np.float32)
    faiss.normalize_L2(emb_in_db)

    ind = faiss.IndexFlatIP(1536)
    ind.add(emb_in_db)

    faiss.write_index(ind, "faiss.index")

    print('built faiss file successfully')

buildFAISS()

# python build_faiss.py

