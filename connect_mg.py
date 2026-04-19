from dotenv import load_dotenv
from pymongo import MongoClient
import os

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
DB_NAME = "db"
COLLECTION_NAME = "rag"


def get_mongo_client():
    if not MONGODB_URI:
        raise ValueError(
            "Chua tim thay MONGODB_URI trong file .env. "
            "Hay them dong: MONGODB_URI=\"mongodb://localhost:27017/\""
        )

    return MongoClient(MONGODB_URI)


def get_database():
    client = get_mongo_client()
    return client[DB_NAME]


def get_collection():
    db = get_database()
    col = db[COLLECTION_NAME]
    return col


def ping_mongodb():
    client = get_mongo_client()
    client.admin.command("ping")
    return True


try:
    collection = get_collection() if MONGODB_URI else None
except Exception:
    collection = None


if __name__ == "__main__":
    try:
        ping_mongodb()
        print(f"Ket noi MongoDB thanh cong toi database '{DB_NAME}', collection '{COLLECTION_NAME}'.")
    except Exception as error:
        print(f"Loi ket noi MongoDB: {error}")
