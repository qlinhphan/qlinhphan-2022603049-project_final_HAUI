import React, { useMemo, useState } from "react";
import { apiLogin } from "../axios/loginAPI";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";

const initialForm = {
    email: "",
    password: "",
};

export default function Logins() {
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [popup, setPopup] = useState({
        open: false,
        title: "",
        message: "",
    });

    const isFormComplete = useMemo(
        () => form.email.trim() && form.password.trim(),
        [form.email, form.password]
    );

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));

        setErrors((current) => ({
            ...current,
            [name]: "",
        }));

        if (popup.open) {
            setPopup((current) => ({
                ...current,
                open: false,
            }));
        }
    };

    // const validateForm = () => {
    //     const nextErrors = {};
    //     const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    //     if (!form.email.trim()) {
    //         nextErrors.email = "Vui long nhap email.";
    //     } else if (!emailPattern.test(form.email.trim())) {
    //         nextErrors.email = "Email khong dung dinh dang.";
    //     }

    //     if (!form.password.trim()) {
    //         nextErrors.password = "Vui long nhap mat khau.";
    //     } else if (form.password.trim().length < 6) {
    //         nextErrors.password = "Mat khau can it nhat 6 ky tu.";
    //     }

    //     setErrors(nextErrors);
    //     return Object.keys(nextErrors).length === 0;
    // };

    const navi = useNavigate()

    const dispatch = useDispatch()

    const closePopup = () => {
        setPopup({
            open: false,
            title: "",
            message: "",
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // if (!validateForm()) {
        //     return;
        // }

        setIsSubmitting(true);

        try {
            await new Promise((resolve) => setTimeout(resolve, 900));
            // console.log("Login payload:", {
            //     email: form.email.trim(),
            //     password: form.password,
            // });
            const email = form.email
            const password = form.password

            const rs = await apiLogin(email, password)

            // console.log("success: ", rs.data.message)

            dispatch({
                type: "user-login",
                payload: rs.data.message
            })

            console.log("rs: ", rs.data.message.roleName);

            if (rs.data.message.roleName == "admin") {
                navi('/admin')
            } else {
                navi("/")
            }


            // navi("/")

        } catch (error) {
            console.error("Login failed:", error);

            const status = error?.response?.status;
            const serverMessage =
                error?.response?.data?.message ||
                error?.response?.data?.detail;

            setPopup({
                open: true,
                title: "Đăng nhập thất bại",
                message:
                    status === 401 || status === 400
                        ? "Email hoặc mật khẩu không đúng, vui lòng kiểm tra lại."
                        : serverMessage || "Không thể đăng nhập lúc này, thử lại sau bạn nhaaa.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen overflow-hidden bg-[#f4efe7] text-slate-900">
            {popup.open ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm">
                    <div className="w-full max-w-sm rounded-[28px] bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.25)]">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-2xl font-bold text-rose-600">
                            !
                        </div>
                        <h3 className="mt-5 text-2xl font-bold text-slate-900">{popup.title}</h3>
                        <p className="mt-3 text-sm leading-6 text-slate-500">{popup.message}</p>
                        <button
                            type="button"
                            onClick={closePopup}
                            className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-[#152238] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0f1a2d]"
                        >
                            Đã hiểu
                        </button>
                    </div>
                </div>
            ) : null}

            <div className="relative isolate min-h-screen">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.2),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.2),_transparent_30%),linear-gradient(135deg,_#f8f3eb_0%,_#f1f5f9_45%,_#fff8ef_100%)]" />

                <div className="mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-4 py-10 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-12">
                    <section className="relative overflow-hidden rounded-[32px] bg-[#152238] px-6 py-8 text-white shadow-[0_30px_80px_rgba(15,23,42,0.28)] md:px-10 md:py-12">
                        <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-cyan-400/20 blur-3xl" />
                        <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-amber-300/20 blur-3xl" />

                        <div className="relative space-y-8">
                            <div className="space-y-4">
                                <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-1 text-sm font-medium tracking-[0.18em] text-slate-200">
                                    WELCOME BACK
                                </span>
                                <div className="space-y-4">
                                    <h1 className="max-w-xl text-4xl font-bold leading-tight md:text-5xl">
                                        Đăng nhập để tiếp tục một cách nhanh gọn
                                    </h1>
                                    <p className="max-w-lg text-sm leading-7 text-slate-300 md:text-base">
                                        Giao diện được thiết kế phong cách sáng, hiện đại và tập trung vào thao tác
                                        đăng nhập bằng email và mật khẩu.
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-3">
                                <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                                    <p className="text-sm text-slate-300">Bảo mật</p>
                                    <p className="mt-3 text-lg font-semibold">Đăng nhập an toàn</p>
                                </div>
                                <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                                    <p className="text-sm text-slate-300">Truy cập</p>
                                    <p className="mt-3 text-lg font-semibold">Email duy nhất</p>
                                </div>
                                <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                                    <p className="text-sm text-slate-300">Trải nghiệm</p>
                                    <p className="mt-3 text-lg font-semibold">Tối giản, dễ sử dụng</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="rounded-[32px] border border-white/70 bg-white/85 p-6 shadow-[0_24px_70px_rgba(148,163,184,0.2)] backdrop-blur xl:p-8">
                        <div className="mx-auto max-w-md">
                            <div className="space-y-3">
                                <span className="inline-flex rounded-full bg-amber-100 px-4 py-1 text-sm font-semibold text-amber-800">
                                    Sign in
                                </span>
                                <h2 className="text-3xl font-bold text-slate-900">Chào mừng trở lại</h2>
                                <p className="text-sm leading-6 text-slate-500">
                                    Nhập email và mật khẩu để tiếp tục.
                                </p>
                            </div>

                            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-semibold text-slate-700">
                                        Email
                                    </label>
                                    <div className="rounded-2xl border border-slate-200 bg-slate-50 transition focus-within:border-cyan-500 focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(6,182,212,0.12)]">
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            placeholder="ban@example.com"
                                            className="w-full rounded-2xl bg-transparent px-4 py-4 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                                        />
                                    </div>
                                    {errors.email ? <p className="text-sm text-rose-500">{errors.email}</p> : null}
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between gap-3">
                                        <label htmlFor="password" className="text-sm font-semibold text-slate-700">
                                            Mật khẩu
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setIsPasswordVisible((current) => !current)}
                                            className="text-sm font-medium text-cyan-700 transition hover:text-cyan-800"
                                        >
                                            {isPasswordVisible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                                        </button>
                                    </div>
                                    <div className="rounded-2xl border border-slate-200 bg-slate-50 transition focus-within:border-cyan-500 focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(6,182,212,0.12)]">
                                        <input
                                            id="password"
                                            name="password"
                                            type={isPasswordVisible ? "text" : "password"}
                                            value={form.password}
                                            onChange={handleChange}
                                            placeholder="Nhap mat khau"
                                            className="w-full rounded-2xl bg-transparent px-4 py-4 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                                        />
                                    </div>
                                    {errors.password ? <p className="text-sm text-rose-500">{errors.password}</p> : null}
                                </div>

                                <button
                                    type="submit"
                                    disabled={!isFormComplete || isSubmitting}
                                    className="inline-flex w-full items-center justify-center rounded-2xl bg-[#152238] px-5 py-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#0f1a2d] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
                                >
                                    {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
                                </button>
                            </form>

                            {/* <div className="mt-6 rounded-3xl bg-slate-50 p-4 text-sm leading-6 text-slate-500">
                                Form nay da toi uu cho 2 truong thong tin duy nhat: email va mat khau, de ban noi API dang nhap sau.
                            </div> */}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
