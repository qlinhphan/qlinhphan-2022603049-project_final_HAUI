import matplotlib.pyplot as plt

# Dữ liệu
labels = ['Train', 'Valid', 'Test']
values = [2145, 613, 306]

# Vẽ biểu đồ cột
plt.figure(figsize=(8, 5))
plt.bar(labels, values)

# Thêm tiêu đề và nhãn
plt.title('Phân bố dữ liệu')
plt.xlabel('Tập dữ liệu')
plt.ylabel('Số lượng ảnh')

# Hiển thị số lên đầu cột
for i, v in enumerate(values):
    plt.text(i, v + 20, str(v), ha='center')

# Hiển thị biểu đồ
plt.show()