# Medical RAG Agent Prototype

Project này là một prototype chatbot hỗ trợ bác sĩ nhập thông tin bệnh nhân bằng ngôn ngữ tự nhiên, trích xuất các trường quan trọng, sau đó truy vấn dữ liệu từ MongoDB + FAISS để gợi ý hướng điều trị tham khảo.

README này được viết lại theo source code hiện có trong repo, không mô tả những tính năng chưa được implement.

## Tổng quan kiến trúc

Ứng dụng hiện tại gồm 2 agent chạy nối tiếp trong `main.py`:

1. `agent_check_input.py`  
   Trích xuất 4 trường bắt buộc từ câu nhập của bác sĩ:
   - `name`: tên khối u, chỉ chấp nhận `glioma`, `vis`, `lis`
   - `area`: diện tích khối u
   - `age`: tuổi bệnh nhân
   - `gender`: giới tính, chỉ chấp nhận `nam`, `nữ`

2. `agent_recommend_via_rag.py`  
   Nhận JSON/text đã đủ thông tin, gọi tool RAG để tìm các bản ghi gần nhất trong tập dữ liệu và diễn giải thành câu trả lời.

RAG được triển khai bởi:
- `prepare_data.py`: đọc dữ liệu từ `data/data.txt`, tạo embedding và lưu vào MongoDB
- `build_faiss.py`: đọc embedding từ MongoDB và build file `faiss.index`
- `rag.py`: embed câu hỏi mới, search top-k từ FAISS, rồi map ngược lại sang dữ liệu trong MongoDB

## Cấu trúc file

- `main.py`: điểm chạy chính, dùng `LangGraph` để nối 2 agent theo chuỗi `i -> r`
- `agent_check_input.py`: agent trích xuất và kiểm tra thông tin đầu vào
- `agent_recommend_via_rag.py`: agent gọi tool RAG và trả về gợi ý
- `rag.py`: hàm `ragOK(question)` để truy vấn vector similarity
- `prepare_data.py`: nạp dữ liệu và embedding vào MongoDB
- `build_faiss.py`: tạo file chỉ mục `faiss.index`
- `connect_mg.py`: helper kết nối MongoDB
- `data/data.txt`: dữ liệu nguồn
- `agent_decided.py`: đang trống, chưa sử dụng
- `agent_analysist_ad_dis.py`: đang trống, chưa sử dụng

## Công nghệ đang dùng

- Python
- MongoDB
- FAISS
- LangChain / LangGraph
- OpenAI-compatible chat model qua `langchain_openai`
- OpenAI embedding model `text-embedding-3-small`

## Biến môi trường

Tạo file `.env` từ `.env.example` và khai báo tối thiểu:

```env
OPENAI_API_KEY=your_api_key
BASE_URL=your_openai_compatible_base_url
MONGODB_URI=mongodb://localhost:27017/
```

Ghi chú:
- Code hiện tại có đọc `BASE_URL` trong cả chat model và embedding model.
- `.env.example` đang có `MODEL_CHAT`, nhưng source hiện tại không sử dụng biến này.

## Cài đặt

Project chưa có `requirements.txt`, bạn có thể cài thủ công:

```bash
pip install pymongo python-dotenv numpy faiss-cpu langchain langgraph langchain-openai langchain-core langchain-classic
```

Nếu dùng môi trường đặc biệt, gói `faiss-cpu` có thể cần thay đổi cho phù hợp.

## Định dạng dữ liệu

File `data/data.txt` được đọc theo format:

```text
name | area | sex | age | treatment
Glioma | 5.1 | male | 30 | Phẫu thuật + dùng thuốc
```

Khi đưa vào MongoDB, mỗi dòng được chuyển thành:

```python
{
    "name": ...,
    "area": int(float(area) * 1000),
    "sex": ...,
    "age": ...,
    "recommend": ...
}
```

Sau đó script `prepare_data.py` lưu thành document dạng:

```python
{
    "text": {...dữ liệu bệnh án...},
    "embedding": [...vector 1536 chiều...]
}
```

## Cách chạy

### 1. Kiểm tra kết nối MongoDB

```bash
python connect_mg.py
```

Script sẽ ping database `db`, collection `rag`.

### 2. Nạp dữ liệu và tạo embedding

```bash
python prepare_data.py
```

Script sẽ:
- đọc `data/data.txt`
- tạo embedding cho từng dòng
- insert vào MongoDB

### 3. Build FAISS index

```bash
python build_faiss.py
```

Script sẽ:
- lấy toàn bộ embedding trong MongoDB
- normalize vector
- tạo `IndexFlatIP(1536)`
- ghi ra file `faiss.index`

### 4. Chạy chatbot

```bash
python main.py
```

Luồng hỏi đáp:
- người dùng nhập mô tả bệnh nhân
- agent 1 trích xuất đủ 4 trường bắt buộc
- agent 2 gọi RAG để tìm các ca tương tự
- hệ thống in ra câu trả lời cuối cùng

Nhập `bye` để thoát.

## Luồng xử lý chi tiết

### `agent_check_input.py`

Agent này sử dụng:
- `ChatOpenAI(model="gpt-4o-mini", base_url=os.getenv("BASE_URL"))`
- tool `toolValidInp(name, gender)` để kiểm tra giá trị hợp lệ
- `ConversationBufferMemory` để giữ hội thoại

Prompt yêu cầu agent:
- phải thu thập đủ `name`, `area`, `age`, `gender`
- nếu thiếu thông tin thì hỏi lại
- khi đủ thì trả về JSON có 4 trường trên

### `agent_recommend_via_rag.py`

Agent này:
- nhận output từ agent đầu
- gọi tool `toolRagOk(question)`
- tool sẽ gọi `ragOK(question)` trong `rag.py`

Prompt ép agent phải dựa trên tool, không bốc thêm thông tin không liên quan.

### `rag.py`

Hàm `ragOK(question)` thực hiện:
- tạo embedding cho câu hỏi
- normalize vector query
- đọc `faiss.index`
- search `k = 10`
- lấy danh sách document từ MongoDB
- map chỉ số trả về từ FAISS sang danh sách text/documents

Giá trị trả về hiện tại là danh sách `text` tìm được gần nhất.

## Điểm cần lưu ý trong source hiện tại

- `main.py` gọi `main()` trực tiếp ở cuối file, nên chạy file sẽ vào vòng lặp chat ngay.
- `prepare_data.py` và `build_faiss.py` cũng chạy trực tiếp khi import vì gọi hàm ở cuối file.
- `rag.py` đang có dòng test:

```python
question = "bệnh nhân nam, 47 tuổi, mắc glioma"
ragOK(question=question)
```

Điều này có nghĩa là chỉ cần import `rag.py` cũng có side effect truy vấn ngay.
- `prepare_data.py` không xóa dữ liệu cũ, nên chạy lại nhiều lần sẽ insert trùng document.
- `agent_decided.py` và `agent_analysist_ad_dis.py` chưa có nội dung.
- Dữ liệu trong `data/data.txt` đang có dấu hiệu lỗi encoding tiếng Việt.
- Trong dữ liệu nguồn, trường giới tính đang là `male/female`, trong khi tool validate của agent đầu vào lại chấp nhận `nam/nữ`; đây là một hạn chế logic hiện tại.

## Thứ tự để xây dựng demo từ đầu

1. Tạo `.env`
2. Đảm bảo MongoDB đang chạy
3. Chạy `python prepare_data.py`
4. Chạy `python build_faiss.py`
5. Chạy `python main.py`

## Hướng cải tiến đề xuất

- Tách các dòng test khỏi `rag.py`, `prepare_data.py`, `build_faiss.py` bằng `if __name__ == "__main__":`
- Thêm bước làm sạch hoặc upsert dữ liệu trước khi insert MongoDB
- Đồng bộ schema dữ liệu giới tính giữa dataset và input agent
- Thêm `requirements.txt`
- Hoàn thiện các file agent placeholder để có pipeline phân tích/quyết định rõ ràng hơn
