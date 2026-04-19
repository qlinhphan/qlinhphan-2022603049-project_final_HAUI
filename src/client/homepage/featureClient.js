
const FeatureClient = (setPage) => {
    return (
        <div>
            <div className="grid md:grid-cols-2 gap-12 items-center">
                {/* Left Content */}
                <div>
                    <h2 className="text-5xl font-bold leading-tight mb-6">
                        Nền tảng AI hỗ trợ phát hiện khối u {" "}
                        <span className="text-blue-600">nhanh chóng và chính xác</span>
                    </h2>

                    <p className="text-gray-600 mb-6 text-lg">
                        MedAI ứng dụng trí tuệ nhân tạo để phân tích hình ảnh y khoa (MRI, CT),
                        giúp bác sĩ phát hiện sớm các dấu hiệu bất thường, phân loại khối u
                        và ước tính diện tích với độ chính xác cao. Giải pháp được thiết kế
                        nhằm tối ưu hóa quy trình chẩn đoán, giảm thời gian xử lý và hỗ trợ
                        ra quyết định lâm sàng hiệu quả hơn.
                    </p>

                    <p className="text-gray-600 mb-8">
                        Hệ thống không chỉ cung cấp kết quả nhanh chóng mà còn lưu trữ lịch sử
                        phân tích, hỗ trợ theo dõi tiến triển của bệnh nhân theo thời gian.
                        Đây là công cụ hỗ trợ đắc lực cho bác sĩ trong môi trường y tế hiện đại,
                        nơi tốc độ và độ chính xác đóng vai trò then chốt.
                    </p>

                    <div className="flex gap-4">
                        <button
                            onClick={() => setPage("dashboard")}
                            className="bg-blue-600 text-white px-8 py-3 rounded-xl shadow hover:bg-blue-700 transition"
                        >
                            Bắt đầu phân tích
                        </button>

                        <button className="border px-8 py-3 rounded-xl hover:bg-gray-100 transition">
                            Tìm hiểu thêm
                        </button>
                    </div>
                </div>

                {/* Right Content */}
                <div className="bg-white p-8 rounded-2xl shadow-md border">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-xl text-slate-900">Tính năng nổi bật</h3>
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                            Bộ công cụ AI lâm sàng
                        </span>
                    </div>

                    <div className="grid gap-3">
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-sm font-semibold text-slate-900">Phát hiện bất thường tự động</p>
                            <p className="text-sm text-slate-600 mt-1">Khoanh vùng nghi ngờ khối u nhanh trên ảnh MRI/CT bằng AI.</p>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-sm font-semibold text-slate-900">Phân loại và ước tính mức độ nguy cơ</p>
                            <p className="text-sm text-slate-600 mt-1">Hỗ trợ nhận diện lành tính/ác tính kèm độ tin cậy của kết quả.</p>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-sm font-semibold text-slate-900">Đo diện tích và vị trí tổn thương</p>
                            <p className="text-sm text-slate-600 mt-1">Tính toán vùng ảnh hưởng để theo dõi tiến triển qua từng lần chụp.</p>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-sm font-semibold text-slate-900">Quản lý lịch sử bệnh nhân tập trung</p>
                            <p className="text-sm text-slate-600 mt-1">Lưu trữ kết quả phân tích để đối chiếu và tham khảo theo thời gian.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-5">
                        <div className="rounded-xl bg-blue-600 text-white p-4">
                            <p className="text-xs uppercase tracking-wide text-blue-100">Thời gian xử lý</p>
                            <p className="text-2xl font-bold mt-1">~30 giây</p>
                        </div>
                        <div className="rounded-xl bg-slate-900 text-white p-4">
                            <p className="text-xs uppercase tracking-wide text-slate-300">Sẵn sàng hệ thống</p>
                            <p className="text-2xl font-bold mt-1">24/7</p>
                        </div>
                    </div>

                    <div className="mt-5 p-4 bg-amber-50 rounded-xl border border-amber-200 text-sm text-amber-900">
                        <b>Lưu ý:</b> Kết quả AI mang tính chất hỗ trợ, không thay thế chẩn đoán của bác sĩ chuyên môn.
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FeatureClient