import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { apiLogout } from "../../axios/loginAPI";

const HeaderClient = () => {
    const navi = useNavigate();
    const dispatch = useDispatch();

    const accessToken = useSelector((state) => state.user.user.accessToken);
    const isLoggedIn = Boolean(accessToken);

    const [isLogoutPopupOpen, setIsLogoutPopupOpen] = useState(false);

    const handleHome = () => {
        navi("/");
    };

    const handleAna = () => {
        navi("/analysist");
    };

    const handlePat = () => {
        navi("/patient");
    };

    const handleLogin = () => {
        navi("/login");
    };

    const openLogoutPopup = () => {
        setIsLogoutPopupOpen(true);
    };

    const closeLogoutPopup = () => {
        setIsLogoutPopupOpen(false);
    };

    const handleLogout = async () => {
        try {
            if (accessToken) {
                await apiLogout(accessToken);
            }
        } catch (error) {
            console.error("Lỗi đăng xuất:", error);
        } finally {
            setIsLogoutPopupOpen(false);
            dispatch({
                type: "logout",
                payload: "",
            });
            navi("/login");
        }
    };

    return (
        <div>
            {isLogoutPopupOpen ? (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.25)]">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-2xl font-bold text-amber-600">
                            ?
                        </div>
                        <h3 className="mt-5 text-2xl font-bold text-slate-900">Xác nhận đăng xuất</h3>
                        <p className="mt-3 text-sm leading-6 text-slate-500">
                            Bạn có chắc không? Nếu xác nhận, bạn sẽ được đưa về trang đăng nhập.
                        </p>

                        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                            <button
                                type="button"
                                onClick={closeLogoutPopup}
                                className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                                Ở lại
                            </button>
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="inline-flex w-full items-center justify-center rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
                            >
                                Chắc chắn đăng xuất
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}

            <div className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 shadow-sm backdrop-blur">
                <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 font-bold text-white shadow">
                            M
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 md:text-2xl">MedAI</h1>
                            <p className="text-xs text-slate-500">Nền tảng trí tuệ y khoa</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {isLoggedIn ? (
                            <>
                                <button
                                    onClick={handleHome}
                                    className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-blue-600"
                                >
                                    Trang chủ
                                </button>
                                <button
                                    onClick={handleAna}
                                    className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-blue-600"
                                >
                                    Bảng điều khiển
                                </button>
                                <button
                                    onClick={handlePat}
                                    className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-blue-600"
                                >
                                    Danh sách bệnh nhân
                                </button>
                                {/* <button className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-blue-600">
                                    Cập nhật thông tin cá nhân
                                </button> */}
                                <button
                                    className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
                                    onClick={openLogoutPopup}
                                >
                                    Đăng xuất
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={handleLogin}
                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                            >
                                Đăng nhập
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeaderClient;
