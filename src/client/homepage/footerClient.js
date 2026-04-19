
const FooterClient = (setPage) => {
    return (
        <div>
            {/* Footer */}
            <footer className="bg-slate-900 text-slate-200 mt-12">
                <div className="max-w-7xl mx-auto px-6 py-10 grid gap-8 md:grid-cols-4">
                    <div className="md:col-span-2 space-y-3">
                        <h3 className="text-2xl font-bold text-white">MedAI</h3>
                        <p className="text-slate-300 max-w-xl">
                            Nền tảng hỗ trợ chẩn đoán hình ảnh y khoa bằng AI, giúp bác sĩ
                            nâng cao tốc độ phân tích và độ chính xác trong điều trị.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-3">Điều hướng</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <button onClick={() => setPage("home")} className="hover:text-white transition">
                                    Trang chủ
                                </button>
                            </li>
                            <li>
                                <button onClick={() => setPage("dashboard")} className="hover:text-white transition">
                                    Bảng điều khiển
                                </button>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-3">Liên hệ</h4>
                        <ul className="space-y-2 text-sm text-slate-300">
                            <li>Email: support@medai.vn</li>
                            <li>Hotline: 1900 1234</li>
                            <li>TP. Hồ Chí Minh, Việt Nam</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-700">
                    <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row gap-2 md:items-center md:justify-between text-sm text-slate-400">
                        <p>© {new Date().getFullYear()} MedAI. Bảo lưu mọi quyền.</p>
                        <p>Được xây dựng để hỗ trợ quyết định lâm sàng thông minh hơn.</p>
                    </div>
                </div>
            </footer>

            {/* CSS cho marquee */}
            <style>
                {`
                @keyframes marquee {
                    0% { transform: translateX(100%); }
                    100% { transform: translateX(-100%); }
                }
                .animate-marquee {
                    animation: marquee 15s linear infinite;
                }
                `}
            </style>
        </div>
    )
}

export default FooterClient