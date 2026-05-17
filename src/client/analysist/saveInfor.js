import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { apiSaveInforPatientFull, apiSaveInforPatientNotFull } from "../../axios/analy";

const tumorOptions = ["Glioma", "Meningioma", "Pituitary Tumor"];

const defaultForm = {
    patientType: "new",
    name: "",
    address: "",
    age: "",
    phone: "",
    gender: "male",
    area: "",
    description: "",
    nameType: "Glioma",
};

export default function SaveInfor({ isOpen, onClose, onSubmit, initialData = {} }) {
    const [formData, setFormData] = useState(defaultForm);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState("");
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const accessToken = useSelector((state) => state.user.user.accessToken);

    useEffect(() => {
        if (!isOpen) return;

        setFormData({
            ...defaultForm,
            ...initialData,
            patientType: initialData.patientType || "new",
            name: initialData.name ?? "",
            address: initialData.address ?? "",
            age: initialData.age ?? "",
            phone: initialData.phone ?? "",
            gender: initialData.gender || "male",
            area: initialData.area ?? "",
            description: initialData.description ?? "",
            nameType: initialData.nameType || "Glioma",
        });
        setSaveError("");
    }, [initialData, isOpen]);

    useEffect(() => {
        if (!isOpen) return undefined;

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                if (isSuccessOpen) {
                    setIsSuccessOpen(false);
                    onClose?.();
                    return;
                }
                onClose?.();
            }
        };

        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [isOpen, isSuccessOpen, onClose]);

    if (!isOpen) return null;

    const isReturningPatient = formData.patientType === "returning";

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const isPreviousPatient = formData.patientType === "returning";
        const normalizedData = {
            ...formData,
            isPreviousPatient,
            age: formData.age ? Number(formData.age) : "",
            area: formData.area ? Number(formData.area) : "",
        };

        setSaveError("");
        setIsSaving(true);

        try {
            if (isPreviousPatient) {
                await apiSaveInforPatientNotFull(
                    accessToken,
                    normalizedData.phone,
                    normalizedData.area,
                    normalizedData.description,
                    normalizedData.nameType
                );
            } else {
                await apiSaveInforPatientFull(
                    accessToken,
                    normalizedData.name,
                    normalizedData.address,
                    normalizedData.age,
                    normalizedData.phone,
                    normalizedData.gender,
                    normalizedData.area,
                    normalizedData.description,
                    normalizedData.nameType
                );
            }

            onSubmit?.(normalizedData);
            setIsSuccessOpen(true);
        } catch (error) {
            setSaveError(
                error?.response?.data?.message ||
                error?.response?.data?.detail ||
                "Lưu thông tin thất bại. Vui lòng thử lại."
            );
        } finally {
            setIsSaving(false);
        }
    };

    const renderInput = (label, name, type = "text", placeholder = "", fullWidth = false) => (
        <label className={`space-y-2 ${fullWidth ? "md:col-span-2" : ""}`}>
            <span className="text-sm font-medium text-slate-700">{label}</span>
            <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-400"
            />
        </label>
    );

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/45 p-3 backdrop-blur-sm md:p-6">
            <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl">
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4 md:px-6">
                    <div>
                        <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-700">Lưu thông tin</p>
                        <h2 className="mt-2 text-xl font-bold text-slate-900 md:text-2xl">Thông tin bệnh nhân</h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Chọn loại bệnh nhân và điền đủ thông tin cần thiết trước khi lưu.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="shrink-0 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-cyan-300 hover:text-cyan-700"
                    >
                        Đóng
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
                    <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 md:px-6">
                        <div className="grid gap-3 md:grid-cols-2">
                            <button
                                type="button"
                                onClick={() => setFormData((current) => ({ ...current, patientType: "new" }))}
                                className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${formData.patientType === "new"
                                    ? "border-cyan-500 bg-cyan-50 text-cyan-700"
                                    : "border-slate-200 bg-white text-slate-600 hover:border-cyan-300"
                                    }`}
                            >
                                Bệnh nhân chưa từng khám
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData((current) => ({ ...current, patientType: "returning" }))}
                                className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${formData.patientType === "returning"
                                    ? "border-cyan-500 bg-cyan-50 text-cyan-700"
                                    : "border-slate-200 bg-white text-slate-600 hover:border-cyan-300"
                                    }`}
                            >
                                Bệnh nhân đã từng khám
                            </button>
                        </div>

                        <div className="mt-5 grid gap-4 md:grid-cols-2">
                            {!isReturningPatient ? renderInput("Tên bệnh nhân", "name", "text", "Nhập tên bệnh nhân") : null}
                            {!isReturningPatient ? renderInput("Tuổi", "age", "number", "Nhập tuổi") : null}
                            {!isReturningPatient ? renderInput("Địa chỉ", "address", "text", "Nhập địa chỉ", true) : null}
                            {renderInput("Số điện thoại", "phone", "tel", "Nhập số điện thoại")}
                            {renderInput("Diện tích", "area", "number", "Nhập diện tích")}

                            {!isReturningPatient ? (
                                <label className="space-y-2">
                                    <span className="text-sm font-medium text-slate-700">Giới tính</span>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-400"
                                    >
                                        <option value="male">Nam</option>
                                        <option value="female">Nữ</option>
                                    </select>
                                </label>
                            ) : null}

                            <label className="space-y-2">
                                <span className="text-sm font-medium text-slate-700">Loại khối u</span>
                                <select
                                    name="nameType"
                                    value={formData.nameType}
                                    onChange={handleChange}
                                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-400"
                                >
                                    {tumorOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label className="space-y-2 md:col-span-2">
                                <span className="text-sm font-medium text-slate-700">Mô tả</span>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Nhập mô tả tình trạng bệnh nhân"
                                    rows={isReturningPatient ? 5 : 4}
                                    className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-400"
                                />
                            </label>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-5 py-4 md:px-6">
                        {saveError ? <p className="mr-auto text-sm font-medium text-red-600">{saveError}</p> : null}
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="rounded-2xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSaving ? "Đang lưu..." : "Lưu thông tin"}
                        </button>
                    </div>
                </form>
            </div>

            {isSuccessOpen ? (
                <div className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-950/50 p-4">
                    <div className="w-full max-w-md rounded-[28px] bg-white p-6 text-center shadow-2xl">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl font-bold text-emerald-600">
                            ✓
                        </div>
                        <h3 className="mt-4 text-2xl font-bold text-slate-900">Lưu thành công</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Thông tin bệnh nhân đã được lưu thành công.
                        </p>
                        <div className="mt-6 flex justify-center">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsSuccessOpen(false);
                                    onClose?.();
                                }}
                                className="rounded-2xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
