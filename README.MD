# Agent RAG Cho Gợi Ý Điều Trị

Project này là một prototype nhỏ để:
- nhập thông tin bệnh nhân bằng ngôn ngữ tự nhiên
- trích xuất các trường cần thiết bằng LLM
- lưu dữ liệu đã embedding vào MongoDB
- tạo chỉ mục FAISS
- tìm các ca tương tự để hỗ trợ gợi ý

Hiện tại code được tách thành các bước nhỏ để dễ test từng phần.

## Cấu trúc file

- `check_input.py`: dùng LLM để trích xuất `age`, `area`, `type`, `sex` từ câu nhập của bác sĩ.
- `connect_mg.py`: kết nối MongoDB tới database `db` và collection `rag`.
- `prepare_data.py`: đọc file `data/data.txt`, chuyển dữ liệu thành dict, tạo embedding và lưu vào MongoDB.
- `build_faiss.py`: đọc embedding từ MongoDB và tạo file `faiss.index`.
- `rag.py`: embed câu hỏi mới, tìm top `k=5` vector gần nhất trong FAISS, sau đó map lại về dữ liệu trong MongoDB.
- `data/data.txt`: dữ liệu nguồn để nạp vào hệ thống.
- `agent_analysist.py`: Phân tích các khuyến nghị mà agent_recommend.py đưa ra.
- `agent_recommend.py`: Đưa ra các khuyến nghị cần thiết.

Lưu ý:
- Hai file `agent_analysist.py` và `agent_recommend.py` sẽ được viết sau, bên trong có thể chứa `llm`, `prompt`, `tool`.
- README này chỉ mô tả code hiện tại.
- Không sửa nội dung hai file agent nếu chưa có yêu cầu mới.

## Công nghệ đang dùng

- Python
- MongoDB
- FAISS
- LangChain
- OpenAI Embeddings
- OpenAI Chat Model

## Biến môi trường

File `.env` cần có ít nhất:

```env
OPENAI_API_KEY="your_openai_api_key"
MODEL_CHAT="gpt-4o-mini"
MONGODB_URI="mongodb://localhost:27017/"
```

## Cài đặt thư viện

Bạn có thể cài các thư viện cần thiết bằng:

```bash
pip install pymongo python-dotenv langchain langchain-openai langchain-core langchain-classic faiss-cpu numpy
```

Nếu máy đang dùng GPU hoặc môi trường đặc biệt, phần `faiss-cpu` có thể cần đổi lại cho phù hợp.

## Định dạng dữ liệu đầu vào

File `data/data.txt` đang được đọc theo format:

```text
name | area | sex | age | treatment
Glioma | 5.1 | male | 30 | Phẫu thuật
```

Khi xử lý trong `prepare_data.py`:
- `name` -> tên bệnh / loại u
- `area` -> được nhân `1000` và ép kiểu `int`
- `sex` -> giới tính
- `age` -> tuổi
- `recommend` -> hướng điều trị

## Luồng chạy hiện tại

### 1. Kết nối MongoDB

File `connect_mg.py` cung cấp:

```python
from connect_mg import get_collection

collection = get_collection()
```

Database đang sử dụng:
- database: `db`
- collection: `rag`

Test nhanh kết nối:

```bash
python connect_mg.py
```

### 2. Nạp dữ liệu và embedding vào MongoDB

Chạy:

```bash
python prepare_data.py
```

File này sẽ:
- đọc `data/data.txt`
- chuyển từng dòng thành object Python
- tạo embedding bằng model `text-embedding-3-small`
- lưu vào MongoDB với 2 trường chính:
  - `text`
  - `embedding`

Lưu ý:
- Nếu chạy nhiều lần, dữ liệu có thể bị insert trùng vì hiện tại chưa có bước xóa hoặc upsert.

### 3. Tạo FAISS index

Chạy:

```bash
python build_faiss.py
```

File này sẽ:
- đọc toàn bộ document trong collection `rag`
- lấy trường `embedding`
- normalize vector
- tạo `IndexFlatIP(1536)`
- ghi ra file `faiss.index`

### 4. Truy vấn RAG thử nghiệm

Chạy:

```bash
python rag.py
```

File này hiện đang:
- embed một câu hỏi mẫu
- đọc file `faiss.index`
- search top 5 vector gần nhất
- lấy chỉ số tìm được
- map ngược lại dữ liệu trong MongoDB
- in ra các bản ghi phù hợp

Ví dụ câu hỏi hiện tại trong code:

```python
question = "bệnh nhân nam, 47 tuổi, mắc glioma"
```

## Trích xuất thông tin bệnh nhân

File `check_input.py` dùng `ChatOpenAI` để trích xuất:
- `age`
- `area`
- `type`
- `sex`

Hàm chính:

```python
from check_input import checkInput

result = checkInput()
print(result)
```

Mục tiêu của prompt là:
- nếu thiếu thông tin thì hỏi lại
- khi đủ thông tin thì trả về JSON

Dạng JSON mong muốn:

```json
{
  "age": null,
  "area": null,
  "type": null,
  "sex": null
}
```

## Thứ tự chạy để xây dựng demo

Nếu bạn muốn chạy từ đầu đến cuối, thứ tự đề xuất là:

1. Cập nhật `.env`
2. Đảm bảo MongoDB đang chạy
3. Chạy `python prepare_data.py`
4. Chạy `python build_faiss.py`
5. Chạy `python rag.py`
6. Chạy `checkInput()` để test nhập thông tin bệnh nhân

## Hạn chế hiện tại

- `prepare_data.py` sẽ insert trùng dữ liệu nếu chạy lại nhiều lần.
- `rag.py` đang là file test, chưa đóng gói thành hàm trả kết quả hoàn chỉnh.
- `check_input.py` đang `return` ngay sau một lượt hỏi đáp đầu tiên.
- Dữ liệu gốc đang có dấu hiệu lỗi mã hóa tiếng Việt trong `data/data.txt`.
- Chưa có pipeline kết nối trọn vẹn giữa `check_input.py`, RAG và module recommend.

## Hướng phát triển tiếp theo

- Viết `agent_analysist.py` để phân tích đầu vào bệnh nhân.
- Viết `agent_recommend.py` để đưa ra gợi ý điều trị.
- Nối `check_input.py` -> RAG -> recommend thành một luồng chạy thống nhất.
- Thêm bước làm sạch dữ liệu và tránh insert trùng.
- Đóng gói lại thành API hoặc chatbot.
