# Medical RAG Agent

Prototype tro ly AI ho tro bac si nhap thong tin benh nhan bang ngon ngu tu nhien, kiem tra du lieu dau vao, tim cac ca tuong tu bang RAG, sau do dua ra goi y dieu tri tham khao.

README nay duoc viet lai theo source code hien co trong repo o thoi diem hien tai.

## Tong quan

Du an hien gom 2 cach su dung chinh:

1. `main.py`
Chay giao dien dong lenh de hoi dap truc tiep.

2. `api.py`
Cung cap API FastAPI de frontend hoac he thong khac goi vao.

Luong xu ly hien tai gom 3 agent:

1. `agent_check_input.py`
Trich xuat va kiem tra 4 truong bat buoc:
- `name`
- `area`
- `age`
- `gender`

2. `agent_recommend_via_rag.py`
Neu da du 4 truong, agent se goi RAG de tim cac ban ghi gan nhat va dien giai thanh cau tra loi.

3. `agent_analysist_ad_dis.py`
Neu nguoi dung muon di sau hon, agent nay phan tich uu diem va nhuoc diem cua cac phuong phap dieu tri tim duoc.

## Kien truc du lieu

Pipeline RAG hien tai:

1. `prepare_data.py`
Doc `data/data.txt`, chuan hoa moi dong thanh object, tao embedding va luu vao MongoDB.

2. `build_faiss.py`
Lay embedding tu MongoDB, normalize vector, build chi muc `faiss.index`.

3. `rag.py`
Embed cau hoi moi, tim `top-k` trong FAISS, sau do map nguoc ve du lieu trong MongoDB.

## Cau truc file

- `main.py`: diem chay CLI, dung `LangGraph` de noi cac agent thanh workflow.
- `api.py`: FastAPI app cho chatbot.
- `agent_check_input.py`: agent trich xuat va kiem tra dau vao.
- `agent_recommend_via_rag.py`: agent goi tool RAG de lay goi y dieu tri.
- `agent_analysist_ad_dis.py`: agent phan tich uu va nhuoc diem cua cac phuong phap.
- `rag.py`: ham `ragOK(question)` de truy van vector similarity.
- `prepare_data.py`: nap du lieu va tao embedding.
- `build_faiss.py`: tao file `faiss.index`.
- `connect_mg.py`: helper ket noi MongoDB.
- `data/data.txt`: nguon du lieu text cho demo.
- `faiss.index`: chi muc FAISS da build.

## Cong nghe dang dung

- Python
- FastAPI
- MongoDB
- FAISS
- LangChain
- LangGraph
- `langchain-openai`

Model dang duoc hard-code trong source:

- Chat model: `gpt-4o-mini`
- Embedding model: `text-embedding-3-small`

## Bien moi truong

Tao file `.env` dua tren `.env.example`:

```env
OPENAI_API_KEY=your_api_key
MONGODB_URI=mongodb://localhost:27017/
MODEL_CHAT=
```

Luu y quan trong:

- Source hien tai co doc `OPENAI_API_KEY` va `MONGODB_URI`.
- Cac file agent va embedding dang goi `base_url=os.getenv("BASE_URL")`, nhung `.env.example` chua khai bao `BASE_URL`.
- Neu ban dung OpenAI-compatible endpoint khac OpenAI goc, hay tu them:

```env
BASE_URL=https://your-openai-compatible-endpoint/v1
```

## Cai dat

Repo hien chua co `requirements.txt`, ban co the cai thu cong:

```bash
pip install fastapi uvicorn pymongo python-dotenv numpy faiss-cpu langchain langgraph langchain-openai langchain-core langchain-classic
```

## Dinh dang du lieu dau vao

File `data/data.txt` dang duoc doc theo format:

```text
name | area | sex | age | treatment
Glioma | 5.1 | male | 30 | dung thuoc
```

Khi dua vao MongoDB, moi dong duoc chuyen thanh:

```python
{
    "name": "...",
    "area": int(float(area) * 1000),
    "sex": "...",
    "age": "...",
    "recommend": "..."
}
```

Sau do `prepare_data.py` luu document dang:

```python
{
    "text": {...},
    "embedding": [...vector...]
}
```

## Cach chay

### 1. Kiem tra MongoDB

```bash
python connect_mg.py
```

Neu thanh cong, script se bao da ket noi toi database `db`, collection `rag`.

### 2. Nap du lieu va tao embedding

```bash
python prepare_data.py
```

### 3. Build FAISS index

```bash
python build_faiss.py
```

### 4. Chay ban CLI

```bash
python main.py
```

Luong CLI:

- Nguoi dung nhap mo ta benh nhan.
- Agent 1 kiem tra da du `name`, `area`, `age`, `gender` hay chua.
- Neu chua du, he thong hoi bo sung.
- Neu da du, agent RAG tra ve goi y dieu tri.
- Sau do he thong hoi co muon phan tich uu/nhuoc diem hay khong.

Nhap `bye` de thoat.

### 5. Chay ban API

```bash
python api.py
```

Mac dinh API chay tai:

```text
http://0.0.0.0:8001
```

Endpoint co san:

- `GET /`
- `GET /health`
- `POST /chat`

## API `POST /chat`

Request:

```json
{
  "question": "Benh nhan nam 47 tuoi, khoi u glioma, area 5100",
  "thread_id": "session-1"
}
```

Response khi da co goi y:

```json
{
  "thread_id": "session-1",
  "question": "Benh nhan nam 47 tuoi, khoi u glioma, area 5100",
  "status": "answered",
  "answer": "...",
  "recommend_rag": "...",
  "check_inp": "...",
  "analysis": null,
  "ask_for_analysis": true,
  "analysis_prompt": "Ban co muon phan tich uu/nhuoc diem cua cac phuong phap nay khong?"
}
```

Neu muon yeu cau phan tich tiep, gui tiep cung `thread_id`:

```json
{
  "thread_id": "session-1",
  "dif": "co"
}
```

Neu khong muon phan tich:

```json
{
  "thread_id": "session-1",
  "dif": "khong"
}
```

## Luong xu ly trong code

### `agent_check_input.py`

- Dung `ChatOpenAI(model="gpt-4o-mini")`
- Dung 2 tool:
  - `toolCheckName`
  - `toolCheckGender`
- Luu lich su bang `ConversationBufferMemory`
- Khi du thong tin, agent duoc prompt de tra ve JSON gom `name`, `area`, `age`, `gender`

### `agent_recommend_via_rag.py`

- Dung tool `toolRagOk(question)`
- Tool nay goi `ragOK(question)` trong `rag.py`
- Agent duoc prompt de chi dua tren ket qua tool, khong boc them thong tin ngoai ngu canh

### `agent_analysist_ad_dis.py`

- Doc cau tra loi tu buoc recommend
- Neu phat hien cac cum nhu `dung thuoc`, `phau thuat`, `theo doi`, `xa tri`, `hoa tri`, `tiem thuoc` va ten khoi u, tool se goi LLM de phan tich uu va nhuoc diem

### `api.py`

- Tao mot `LangGraph` cho moi `thread_id`
- Luu trang thai hoi thoai trong memory
- Ho tro quy trinh 2 buoc:
  - hoi cau dau tien
  - tra loi `dif=co/khong` de quyet dinh co phan tich sau goi y hay khong

## Diem can luu y trong source hien tai

- `prepare_data.py` va `build_faiss.py` dang chay ngay khi import vi goi ham o cuoi file.
- `prepare_data.py` khong xoa du lieu cu, nen chay lai nhieu lan se de bi insert trung.
- `rag.py` dang doc toan bo document trong MongoDB roi map theo index cua FAISS. Cach nay phu thuoc vao thu tu document trong database.
- `main.py` va mot so prompt dang co dau hieu loi encoding tieng Viet.
- `toolCheckGender` dang chap nhan `nam/nu`, trong khi dataset `data/data.txt` dang dung `male/female`.
- `toolCheckName` kiem tra `glioma`, `meningioma`, `pituitary tumor`, nhung prompt trong mot vai cho co the viet hoa hoac khac dau cach.
- `agent_analysist_ad_dis.py` su dung `web_search_preview` thong qua model, nen phan nay phu thuoc kha nhieu vao kha nang cua endpoint LLM dang dung.
- Repo hien co file `api.py`, nhung khong thay file `agent_check_ok.py` trong source dang version hoa, chi thay file `.pyc` trong `__pycache__`.

## Thu tu de demo tu dau

1. Tao `.env`
2. Dam bao MongoDB dang chay
3. Chay `python prepare_data.py`
4. Chay `python build_faiss.py`
5. Chay `python main.py` hoac `python api.py`

## Huong cai tien tiep theo

- Them `requirements.txt`
- Dua cac lenh chay truc tiep vao `if __name__ == "__main__":`
- Dong bo schema gioi tinh giua input va dataset
- Loai bo van de encoding tieng Viet
- Gan ID on dinh cho document de map ket qua FAISS an toan hon
- Bo sung test cho pipeline API va RAG
