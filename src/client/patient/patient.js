import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { apiGetDetail } from "../../axios/analy";

const getGenderLabel = (gender) => {
    if (gender === "male") return "Nam";
    if (gender === "female") return "Nữ";
    return gender || "Chưa cập nhật";
};

const buildPatientNote = (results) => {
    if (!results.length) {
        return "Chưa có dữ liệu kết quả khám được ghi nhận.";
    }

    const latestResult = results[results.length - 1];
    return `Đã ghi nhận ${results.length} lần khám. Kết quả gần nhất: ${latestResult.typeName} với diện tích ${latestResult.area}px.`;
};

const mapPatientsFromApi = (patients, doctorName) => {
    return (patients || []).map((patient, patientIndex) => {
        const results = Array.isArray(patient.results) ? patient.results : [];
        const latestResult = results[results.length - 1] || null;

        return {
            id: patient.phone || `BN-${patientIndex + 1}`,
            name: patient.name || `Bệnh nhân ${patientIndex + 1}`,
            age: patient.age ?? "Chưa cập nhật",
            gender: getGenderLabel(patient.gender),
            phone: patient.phone || "Chưa cập nhật",
            doctor: doctorName || "Bác sĩ phụ trách",
            diagnosis: latestResult?.typeName || "Chưa có chẩn đoán",
            visitCount: results.length,
            note: buildPatientNote(results),
            visits: results.map((result, resultIndex) => ({
                id: `${patient.phone || patientIndex}-${resultIndex}`,
                visitNumber: resultIndex + 1,
                typeName: result.typeName || "Chưa cập nhật",
                area: result.area ?? 0,
            })),
        };
    });
};

export default function Patient() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDoctor] = useState("Tất cả");
    const [selectedPatientId, setSelectedPatientId] = useState("");
    const [patientRecords, setPatientRecords] = useState([]);
    const [summary, setSummary] = useState({ patientIsManaging: 0, sumSeeTheDoctor: 0 });
    const [isLoading, setIsLoading] = useState(false);
    const accessToken = useSelector((state) => state.user.user.accessToken);
    const name = useSelector((state) => state.user.user.name);
    const now = new Date();

    useEffect(() => {
        const fetchPatientDetail = async () => {
            if (!accessToken) return;

            try {
                setIsLoading(true);
                const response = await apiGetDetail(accessToken);
                const message = response?.data?.message || {};
                const mappedPatients = mapPatientsFromApi(message.patients, name);

                setPatientRecords(mappedPatients);
                setSummary({
                    patientIsManaging: message.patientIsManaging || mappedPatients.length,
                    sumSeeTheDoctor: message.sumSeeTheDoctor || 0,
                });
                setSelectedPatientId((currentId) => currentId || mappedPatients[0]?.id || "");
            } catch (error) {
                setPatientRecords([]);
                setSummary({ patientIsManaging: 0, sumSeeTheDoctor: 0 });
            } finally {
                setIsLoading(false);
            }
        };

        fetchPatientDetail();
    }, [accessToken, name]);

    const doctors = useMemo(() => {
        return ["Tất cả", ...new Set(patientRecords.map((patient) => patient.doctor))];
    }, [patientRecords]);

    const filteredPatients = useMemo(() => {
        return patientRecords.filter((patient) => {
            const matchesDoctor = selectedDoctor === "Tất cả" || patient.doctor === selectedDoctor;
            const keyword = searchTerm.trim().toLowerCase();
            const matchesSearch =
                !keyword ||
                patient.name.toLowerCase().includes(keyword) ||
                patient.id.toLowerCase().includes(keyword) ||
                patient.diagnosis.toLowerCase().includes(keyword) ||
                patient.phone.toLowerCase().includes(keyword);

            return matchesDoctor && matchesSearch;
        });
    }, [patientRecords, searchTerm, selectedDoctor]);

    const selectedPatient =
        filteredPatients.find((patient) => patient.id === selectedPatientId) || filteredPatients[0] || null;

    const totalVisits = searchTerm.trim()
        ? filteredPatients.reduce((sum, patient) => sum + patient.visitCount, 0)
        : summary.sumSeeTheDoctor;

    return (
        <div className="min-h-screen bg-slate-100 text-slate-900">
            <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 md:px-6 lg:px-8">
                <section className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-slate-950 px-6 py-8 text-white shadow-xl md:px-10 md:py-10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.24),_transparent_34%),radial-gradient(circle_at_80%_20%,_rgba(59,130,246,0.2),_transparent_28%),linear-gradient(135deg,_rgba(15,23,42,1)_0%,_rgba(8,47,73,1)_52%,_rgba(12,74,110,1)_100%)]" />
                    <div className="absolute -right-16 top-10 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />
                    <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl" />

                    <div className="relative grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
                        <div className="space-y-6">
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-1 text-sm font-medium text-cyan-100">
                                    Patient Overview
                                </span>
                                <span className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-1 text-sm font-medium text-emerald-200">
                                    Clinical Monitoring Dashboard
                                </span>
                            </div>

                            <div className="max-w-3xl space-y-4">
                                <h1 className="text-3xl font-bold leading-tight text-white md:text-5xl">
                                    Quản lý danh sách bệnh nhân đã khám với góc nhìn lâm sàng rõ ràng và hiện đại.
                                </h1>
                                <p className="text-sm leading-7 text-slate-200 md:text-base">
                                    Theo dõi nhanh hồ sơ bệnh nhân theo từng bác sĩ, nắm số lần khám, mức độ ưu tiên và
                                    lịch sử nhận định gần nhất để hỗ trợ đánh giá và ra quyết định hiệu quả hơn.
                                </p>
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="rounded-[24px] border border-white/10 bg-white/10 p-5 backdrop-blur">
                                    <p className="text-xs uppercase tracking-[0.24em] text-cyan-100/80">Bệnh nhân đang quản lý</p>
                                    <p className="mt-3 text-4xl font-bold text-white">
                                        {searchTerm.trim() ? filteredPatients.length : summary.patientIsManaging}
                                    </p>
                                    <p className="mt-2 text-sm text-slate-300">Tổng hồ sơ phù hợp với bộ lọc hiện tại.</p>
                                </div>
                                <div className="rounded-[24px] border border-white/10 bg-white/10 p-5 backdrop-blur">
                                    <p className="text-xs uppercase tracking-[0.24em] text-cyan-100/80">Tổng lượt thăm khám</p>
                                    <p className="mt-3 text-4xl font-bold text-white">{totalVisits}</p>
                                    <p className="mt-2 text-sm text-slate-300">Bao gồm toàn bộ các lần khám đã ghi nhận.</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-4">
                            <div className="rounded-[28px] border border-white/10 bg-white/10 p-5 backdrop-blur">
                                <p className="text-sm font-medium text-cyan-100">Bộ lọc đang áp dụng</p>
                                <div className="mt-4 space-y-4">
                                    <div className="rounded-2xl bg-white/10 p-4">
                                        <p className="text-xs uppercase tracking-[0.24em] text-slate-300">Bác sĩ phụ trách</p>
                                        <p className="mt-2 text-2xl font-semibold text-white">{name}</p>
                                    </div>

                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <div className="rounded-2xl bg-white/5 p-4">
                                            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Cập nhật gần nhất</p>
                                            <p className="mt-2 text-base font-semibold text-white">{now.toLocaleDateString("vi-VN")}</p>
                                        </div>
                                        <div className="rounded-2xl bg-white/5 p-4">
                                            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Số bác sĩ lọc</p>
                                            <p className="mt-2 text-base font-semibold text-white">{doctors.length - 1 || 1}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-[28px] border border-cyan-400/20 bg-cyan-400/10 p-5">
                                <p className="text-xs uppercase tracking-[0.24em] text-cyan-100">Clinical Focus</p>
                                <p className="mt-3 text-lg font-semibold text-white">
                                    {selectedPatient
                                        ? `${selectedPatient.name} hiện là hồ sơ đang được mở để xem chi tiết.`
                                        : "Chọn một bệnh nhân để xem lịch sử khám và nhận định."}
                                </p>
                                <p className="mt-2 text-sm leading-6 text-slate-200">
                                    Phần tổng quan này được thiết kế để bác sĩ nhìn thấy ngay quy mô bệnh nhân, mức độ
                                    ưu tiên và nhịp cập nhật hồ sơ trước khi đi sâu vào từng ca bệnh.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="grid gap-8 xl:grid-cols-[1.08fr_0.92fr]">
                    <div className="space-y-6 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                        <div className="flex flex-col gap-4 border-b border-slate-100 pb-5">
                            <div>
                                <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-700">Patient List</p>
                                <h2 className="mt-2 text-2xl font-bold text-slate-900">Danh sách bệnh nhân</h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Lọc theo bác sĩ và tìm nhanh theo số điện thoại, tên hoặc loại khối u.
                                </p>
                            </div>

                            <div className="grid gap-3 md:grid-cols-[1fr_220px]">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(event) => setSearchTerm(event.target.value)}
                                    placeholder="Tìm theo số điện thoại bệnh nhân"
                                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-400 focus:bg-white"
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="rounded-2xl bg-slate-50 p-4">
                                <p className="text-sm text-slate-500">Bệnh nhân đang hiển thị</p>
                                <p className="mt-2 text-2xl font-bold text-slate-900">{filteredPatients.length}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {isLoading ? (
                                <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
                                    <p className="text-lg font-semibold text-slate-800">Đang tải dữ liệu bệnh nhân</p>
                                    <p className="mt-2 text-sm text-slate-500">Hệ thống đang đồng bộ hồ sơ từ cơ sở dữ liệu.</p>
                                </div>
                            ) : filteredPatients.length > 0 ? (
                                filteredPatients.map((patient) => {
                                    const isActive = selectedPatient?.id === patient.id;

                                    return (
                                        <button
                                            key={patient.id}
                                            type="button"
                                            onClick={() => setSelectedPatientId(patient.id)}
                                            className={`w-full rounded-[24px] border p-5 text-left transition ${isActive
                                                ? "border-cyan-400 bg-cyan-50 shadow-sm"
                                                : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                                                }`}
                                        >
                                            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                                <div className="space-y-3">
                                                    <h3 className="text-lg font-semibold text-slate-900">{patient.name}</h3>
                                                    <p className="text-sm text-slate-500">
                                                        {patient.gender}, {patient.age} tuổi • Bác sĩ phụ trách: {patient.doctor}
                                                    </p>
                                                    <p className="text-sm text-slate-600">Loại khối u gần nhất: {patient.diagnosis}</p>
                                                </div>

                                                <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[290px]">
                                                    <div className="rounded-2xl bg-slate-50 p-3">
                                                        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Lần khám</p>
                                                        <p className="mt-2 text-lg font-bold text-slate-900">{patient.visitCount}</p>
                                                    </div>

                                                    <div className="rounded-2xl bg-slate-50 p-3">
                                                        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Liên hệ</p>
                                                        <p className="mt-2 text-sm font-semibold text-slate-900">{patient.phone}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })
                            ) : (
                                <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
                                    <p className="text-lg font-semibold text-slate-800">Không tìm thấy bệnh nhân phù hợp</p>
                                    <p className="mt-2 text-sm text-slate-500">
                                        Hãy đổi bộ lọc bác sĩ hoặc từ khóa tìm kiếm để xem lại hồ sơ bệnh nhân.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <aside className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                        {selectedPatient ? (
                            <div className="space-y-6">
                                <div className="border-b border-slate-100 pb-5">
                                    <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-700">Patient Detail</p>
                                    <h2 className="mt-2 text-2xl font-bold text-slate-900">{selectedPatient.name}</h2>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Hồ sơ chi tiết về số lần khám và nhận định đã ghi nhận.
                                    </p>
                                </div>

                                <div className="rounded-[24px] bg-slate-900 p-5 text-white">
                                    <div className="flex flex-wrap items-start justify-between gap-4">
                                        <div>
                                            <p className="text-sm text-slate-300">Nhận định hiện tại</p>
                                            <h3 className="mt-2 text-xl font-semibold">Nghi ngờ mắc khối u: {selectedPatient.diagnosis}</h3>
                                        </div>
                                    </div>

                                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                        <div className="rounded-2xl bg-white/5 p-4">
                                            <p className="text-sm text-slate-300">Tổng số lần khám</p>
                                            <p className="mt-2 text-2xl font-bold">{selectedPatient.visitCount}</p>
                                        </div>
                                        <div className="rounded-2xl bg-white/5 p-4">
                                            <p className="text-sm text-slate-300">Bác sĩ phụ trách</p>
                                            <p className="mt-2 text-lg font-semibold">{selectedPatient.doctor}</p>
                                        </div>
                                    </div>

                                    {/* <div className="mt-4 rounded-2xl bg-white/5 p-4">
                                        <p className="text-sm text-slate-300">Ghi chú hồ sơ</p>
                                        <p className="mt-2 text-sm leading-6 text-slate-100">{selectedPatient.note}</p>
                                    </div> */}
                                </div>

                                <div className="grid gap-3 sm:grid-cols-3">
                                    <div className="rounded-2xl bg-slate-50 p-4">
                                        <p className="text-sm text-slate-500">Giới tính</p>
                                        <p className="mt-2 font-semibold text-slate-900">{selectedPatient.gender}</p>
                                    </div>
                                    <div className="rounded-2xl bg-slate-50 p-4">
                                        <p className="text-sm text-slate-500">Tuổi</p>
                                        <p className="mt-2 font-semibold text-slate-900">
                                            {selectedPatient.age}
                                        </p>
                                    </div>
                                    <div className="rounded-2xl bg-slate-50 p-4">
                                        <p className="text-sm text-slate-500">Liên hệ</p>
                                        <p className="mt-2 font-semibold text-slate-900">{selectedPatient.phone}</p>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-700">Visit History</p>
                                            <h3 className="mt-2 text-xl font-bold text-slate-900">Chi tiết số lần khám</h3>
                                        </div>
                                        <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600">
                                            {selectedPatient.visits.length} hồ sơ
                                        </span>
                                    </div>
                                    <div className="mt-4 overflow-hidden rounded-[24px] border border-slate-200">
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-slate-200">
                                                <thead className="bg-slate-50">
                                                    <tr>
                                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                                                            Số lần khám
                                                        </th>
                                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                                                            Loại u
                                                        </th>
                                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                                                            Diện tích
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100 bg-white">
                                                    {selectedPatient.visits.map((visit, index) => (
                                                        <tr key={visit.id} className="text-sm text-slate-700">
                                                            <td className="px-4 py-3 font-semibold text-slate-900">
                                                                Lần {selectedPatient.visitCount - index}
                                                            </td>
                                                            <td className="px-4 py-3">{visit.typeName}</td>
                                                            <td className="px-4 py-3">{visit.area} px</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex h-full min-h-[420px] items-center justify-center rounded-[24px] bg-slate-50 p-8 text-center">
                                <div className="max-w-md">
                                    <p className="text-xl font-semibold text-slate-800">Chưa có hồ sơ để hiển thị</p>
                                    <p className="mt-2 text-sm leading-6 text-slate-500">
                                        Khi có bệnh nhân phù hợp với bộ lọc hiện tại, thông tin chi tiết số lần khám và nhận định sẽ
                                        xuất hiện tại đây.
                                    </p>
                                </div>
                            </div>
                        )}
                    </aside>
                </section>
            </div>
        </div>
    );
}
