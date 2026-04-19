import { useNavigate } from "react-router"

const HeaderClient = (setPage) => {

    const navi = useNavigate()

    const handleHome = () => {
        navi("/")
    }

    const handleAna = () => {
        navi("/analysist")
    }

    const handlePat = () => {
        navi("/patient")
    }

    return (
        <div>
            <div className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center font-bold shadow">
                            M
                        </div>
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold text-slate-900">MedAI</h1>
                            <p className="text-xs text-slate-500">Nền tảng trí tuệ y khoa</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            onClick={() => handleHome()}
                            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-blue-600 transition"
                        >
                            Trang chủ
                        </button>
                        <button
                            onClick={() => { handleAna() }}
                            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-blue-600 transition"
                        >
                            Bảng điều khiển
                        </button>
                        <button
                            onClick={() => handlePat()}
                            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-blue-600 transition"
                        >
                            Danh sách bệnh nhân
                        </button>
                        <button className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-blue-600 transition">
                            Cập nhật thông tin cá nhân
                        </button>
                        <button className="px-4 py-2 rounded-lg text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition">
                            Đăng xuất
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeaderClient