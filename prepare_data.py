from langchain_openai import OpenAIEmbeddings
from dotenv import load_dotenv
load_dotenv()
import os
from connect_mg import get_collection

embeddings = OpenAIEmbeddings(model="text-embedding-3-small", base_url=os.getenv("BASE_URL"))

def prepareData():
    with open('data/data.txt', 'r', encoding='utf-8') as fo:
        data = fo.read()
        data = data.split('\n')
        del data[0]
        # print(data)
        data_to_save = []

        for d in data:
            save = {}
            ds = d.split(' | ')
            save['name'] = ds[0]
            save['area'] = int(float(ds[1]) * 1000)
            save['sex'] = ds[2]
            save['age'] = ds[3]
            save['recommend'] = ds[4]
            data_to_save.append(save)
            # break

        return data_to_save



def embed_data():
    db = get_collection()
    data = prepareData()
    
    data_prepare = [{
        "text": d,
        "embedding": embeddings.embed_query(str(d))
    } for d in data]

    db.insert_many(data_prepare)

    print("saved successfully into MONGOO!")

embed_data()

# python prepare_data.py