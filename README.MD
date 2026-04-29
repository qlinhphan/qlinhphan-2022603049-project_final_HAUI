# Medical RAG Agent

Đây là prototype trợ lý AI hỗ trợ bác sĩ nhập thông tin bệnh nhân bằng ngôn ngữ tự nhiên, kiểm tra dữ liệu đầu vào, tìm các ca tương tự bằng RAG, sau đó đưa ra gợi ý điều trị tham khảo.

README này được viết lại theo source code hiện có trong repo ở thời điểm hiện tại.

## Tổng quan

Dự án hiện có 2 cách sử dụng chính:

1. `main.py`
Chạy giao diện dòng lệnh để hỏi đáp trực tiếp.

2. `api.py`
Cung cấp API FastAPI để frontend hoặc hệ thống khác gọi vào.

Luồng xử lý hiện tại gồm 3 agent:

1. `agent_check_input.py`
Trích xuất và kiểm tra 4 trường bắt buộc:
- `name`
- `area`
- `age`
- `gender`

2. `agent_recommend_via_rag.py`
Nếu đã đủ 4 trường, agent sẽ gọi RAG để tìm các bản ghi gần nhất và diễn giải thành câu trả lời.

3. `agent_analysist_ad_dis.py`
Nếu người dùng muốn đi sâu hơn, agent này phân tích ưu điểm và nhược điểm của các phương pháp điều trị tìm được.

## Kiến trúc dữ liệu

Pipeline RAG hiện tại:

1. `prepare_data.py`
Đọc `data/data.txt`, chuẩn hóa mỗi dòng thành object, tạo embedding và lưu vào MongoDB.

2. `build_faiss.py`
Lấy embedding từ MongoDB, chuẩn hóa vector, build chỉ mục `faiss.index`.

3. `rag.py`
Embed câu hỏi mới, tìm `top-k` trong FAISS, sau đó ánh xạ ngược về dữ liệu trong MongoDB.

## Cấu trúc file

- `main.py`: điểm chạy CLI, dùng `LangGraph` để nối các agent thành workflow.
- `api.py`: FastAPI app cho chatbot.
- `agent_check_input.py`: agent trích xuất và kiểm tra đầu vào.
- `agent_recommend_via_rag.py`: agent gọi tool RAG để lấy gợi ý điều trị.
- `agent_analysist_ad_dis.py`: agent phân tích ưu và nhược điểm của các phương pháp.
- `rag.py`: hàm `ragOK(question)` để truy vấn vector similarity.
- `prepare_data.py`: nạp dữ liệu và tạo embedding.
- `build_faiss.py`: tạo file `faiss.index`.
- `connect_mg.py`: helper kết nối MongoDB.
- `data/data.txt`: nguồn dữ liệu text cho demo.
- `faiss.index`: chỉ mục FAISS đã build.

## Công nghệ đang dùng

- Python
- FastAPI
- MongoDB
- FAISS
- LangChain
- LangGraph
- `langchain-openai`

Model đang được hard-code trong source:

- Chat model: `gpt-4o-mini`
- Embedding model: `text-embedding-3-small`

## Biến môi trường

Tạo file `.env` dựa trên `.env.example`:

```env
OPENAI_API_KEY=your_api_key
MONGODB_URI=mongodb://localhost:27017/
MODEL_CHAT=
```

Lưu ý quan trọng:

- Source hiện tại có đọc `OPENAI_API_KEY` và `MONGODB_URI`.
- Các file agent và embedding đang gọi `base_url=os.getenv("BASE_URL")`, nhưng `.env.example` chưa khai báo `BASE_URL`.
- Nếu bạn dùng OpenAI-compatible endpoint khác OpenAI gốc, hãy tự thêm:

```env
BASE_URL=https://your-openai-compatible-endpoint/v1
```

## Cài đặt

Repo hiện chưa có `requirements.txt`, bạn có thể cài thủ công:

```bash
pip install fastapi uvicorn pymongo python-dotenv numpy faiss-cpu langchain langgraph langchain-openai langchain-core langchain-classic
```

## Định dạng dữ liệu đầu vào

File `data/data.txt` đang được đọc theo format:

```text
name | area | sex | age | treatment
Glioma | 5.1 | male | 30 | dùng thuốc
```

Khi đưa vào MongoDB, mỗi dòng được chuyển thành:

```python
{
    "name": "...",
    "area": int(float(area) * 1000),
    "sex": "...",
    "age": "...",
    "recommend": "..."
}
```

Sau đó `prepare_data.py` lưu document dạng:

```python
{
    "text": {...},
    "embedding": [...vector...]
}
```

## Cách chạy

### 1. Kiểm tra MongoDB

```bash
python connect_mg.py
```

Nếu thành công, script sẽ báo đã kết nối tới database `db`, collection `rag`.

### 2. Nạp dữ liệu và tạo embedding

```bash
python prepare_data.py
```

### 3. Build FAISS index

```bash
python build_faiss.py
```

### 4. Chạy bản CLI

```bash
python main.py
```

Luồng CLI:

- Người dùng nhập mô tả bệnh nhân.
- Agent 1 kiểm tra đã đủ `name`, `area`, `age`, `gender` hay chưa.
- Nếu chưa đủ, hệ thống hỏi bổ sung.
- Nếu đã đủ, agent RAG trả về gợi ý điều trị.
- Sau đó hệ thống hỏi có muốn phân tích ưu/nhược điểm hay không.

Nhập `bye` để thoát.

### 5. Chạy bản API

```bash
python api.py
```

Mặc định API chạy tại:

```text
http://0.0.0.0:8001
```

Endpoint có sẵn:

- `GET /`
- `GET /health`
- `POST /chat`

## API `POST /chat`

Request:

```json
{
  "question": "Bệnh nhân nam 47 tuổi, khối u glioma, area 5100",
  "thread_id": "session-1"
}
```

Response khi đã có gợi ý:

```json
{
  "thread_id": "session-1",
  "question": "Bệnh nhân nam 47 tuổi, khối u glioma, area 5100",
  "status": "answered",
  "answer": "...",
  "recommend_rag": "...",
  "check_inp": "...",
  "analysis": null,
  "ask_for_analysis": true,
  "analysis_prompt": "Bạn có muốn phân tích ưu/nhược điểm của các phương pháp này không?"
}
```

Nếu muốn yêu cầu phân tích tiếp, gửi tiếp cùng `thread_id`:

```json
{
  "thread_id": "session-1",
  "dif": "co"
}
```

Nếu không muốn phân tích:

```json
{
  "thread_id": "session-1",
  "dif": "khong"
}
```

## Luồng xử lý trong code

### `agent_check_input.py`

- Dùng `ChatOpenAI(model="gpt-4o-mini")`
- Dùng 2 tool:
  - `toolCheckName`
  - `toolCheckGender`
- Lưu lịch sử bằng `ConversationBufferMemory`
- Khi đủ thông tin, agent được prompt để trả về JSON gồm `name`, `area`, `age`, `gender`

### `agent_recommend_via_rag.py`

- Dùng tool `toolRagOk(question)`
- Tool này gọi `ragOK(question)` trong `rag.py`
- Agent được prompt để chỉ dựa trên kết quả tool, không bốc thêm thông tin ngoài ngữ cảnh

### `agent_analysist_ad_dis.py`

- Đọc câu trả lời từ bước recommend
- Nếu phát hiện các cụm như `dùng thuốc`, `phẫu thuật`, `theo dõi`, `xạ trị`, `hóa trị`, `tiêm thuốc` và tên khối u, tool sẽ gọi LLM để phân tích ưu và nhược điểm

### `api.py`

- Tạo một `LangGraph` cho mỗi `thread_id`
- Lưu trạng thái hội thoại trong memory
- Hỗ trợ quy trình 2 bước:
  - hỏi câu đầu tiên
  - trả lời `dif=co/khong` để quyết định có phân tích sau gợi ý hay không

## Điểm cần lưu ý trong source hiện tại

- `prepare_data.py` và `build_faiss.py` đang chạy ngay khi import vì gọi hàm ở cuối file.
- `prepare_data.py` không xóa dữ liệu cũ, nên chạy lại nhiều lần sẽ dễ bị insert trùng.
- `rag.py` đang đọc toàn bộ document trong MongoDB rồi map theo index của FAISS. Cách này phụ thuộc vào thứ tự document trong database.
- `main.py` và một số prompt đang có dấu hiệu lỗi encoding tiếng Việt.
- `toolCheckGender` đang chấp nhận `nam/nu`, trong khi dataset `data/data.txt` đang dùng `male/female`.
- `toolCheckName` kiểm tra `glioma`, `meningioma`, `pituitary tumor`, nhưng prompt trong một vài chỗ có thể viết hoa hoặc khác dấu cách.
- `agent_analysist_ad_dis.py` sử dụng `web_search_preview` thông qua model, nên phần này phụ thuộc khá nhiều vào khả năng của endpoint LLM đang dùng.
- Repo hiện có file `api.py`, nhưng không thấy file `agent_check_ok.py` trong source đang version hóa, chỉ thấy file `.pyc` trong `__pycache__`.

## Thứ tự để demo từ đầu

1. Tạo `.env`
2. Đảm bảo MongoDB đang chạy
3. Chạy `python prepare_data.py`
4. Chạy `python build_faiss.py`
5. Chạy `python main.py` hoặc `python api.py`

## Hướng cải tiến tiếp theo

- Thêm `requirements.txt`
- Đưa các lệnh chạy trực tiếp vào `if __name__ == "__main__":`
- Đồng bộ schema giới tính giữa input và dataset
- Loại bỏ vấn đề encoding tiếng Việt
- Gán ID ổn định cho document để map kết quả FAISS an toàn hơn
- Bổ sung test cho pipeline API và RAG
