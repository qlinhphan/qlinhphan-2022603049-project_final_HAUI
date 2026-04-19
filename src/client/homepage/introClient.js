const IntroClient = () => {
    return (
        <div>
            {/* INTRO SECTION */}
            <div className="bg-white p-8 rounded-2xl shadow-md border flex flex-col md:flex-row items-center gap-8">
                {/* Left: Image */}
                <div className="flex-1">
                    <img
                        src="/image.png"
                        alt="Giới thiệu MedAI"
                        className="rounded-2xl shadow-lg w-full object-cover"
                    />
                </div>

                {/* Right: Text + scrolling keywords */}
                <div className="flex-1 space-y-4">
                    <h2 className="text-3xl font-bold text-blue-600">Giới thiệu MedAI</h2>
                    <p className="text-gray-600 text-lg">
                        MedAI là nền tảng ứng dụng trí tuệ nhân tạo trong y tế, hỗ trợ bác sĩ chẩn đoán
                        khối u nhanh chóng, chính xác và hiệu quả. Công nghệ AI giúp phân tích hình ảnh
                        MRI/CT, dự đoán loại khối u và hỗ trợ đưa ra quyết định lâm sàng.
                    </p>

                    {/* Scrolling keywords */}
                    <div className="overflow-hidden relative h-10 mt-4 bg-gray-100 rounded-xl border">
                        <div className="absolute whitespace-nowrap animate-marquee py-2 px-4 text-blue-600 font-semibold">
                            AI &nbsp; • &nbsp; Chẩn đoán nhanh &nbsp; • &nbsp; Phân loại khối u &nbsp; • &nbsp; Giám sát tiến trình &nbsp; • &nbsp; Hỗ trợ bác sĩ
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default IntroClient