import React, { useMemo, useState } from "react";

const patientRecords = [
    {
        id: "BN-1024",
        name: "Nguyen Thi Minh Anh",
        age: 46,
        gender: "Nữ",
        phone: "0903 456 120",
        doctor: "BS. Tran Quoc Bao",
        latestVisit: "2026-04-12",
        riskLevel: "Cần theo dõi sát",
        diagnosis: "Nghi ngờ u thần kinh đệm thùy trán",
        visitCount: 4,
        note: "Bệnh nhân đáp ứng tốt với phác đồ theo dõi hình ảnh định kỳ.",
        visits: [
            {
                date: "2026-04-12",
                type: "Tái khám",
                finding: "Khối bất thường ổn định kích thước, chưa ghi nhận tiến triển rõ.",
                impression: "Tiếp tục theo dõi bằng MRI trong 6 tuần.",
            },
            {
                date: "2026-03-08",
                type: "Đánh giá chuyên sâu",
                finding: "Phát hiện tổn thương nghi ngờ vùng thùy trán trái, bờ không đều.",
                impression: "Khuyến nghị hội chẩn ngoại thần kinh và đối chiếu thêm MRI có cản quang.",
            },
            {
                date: "2026-01-20",
                type: "Khám ban đầu",
                finding: "Đau đầu kéo dài, có dấu hiệu thần kinh khu trú nhẹ.",
                impression: "Chỉ định chụp MRI sọ não để đánh giá tổn thương nội sọ.",
            },
            {
                date: "2025-12-02",
                type: "Tư vấn",
                finding: "Theo dõi triệu chứng đau đầu và thay đổi thị lực thoáng qua.",
                impression: "Hẹn tái khám nếu triệu chứng tiến triển.",
            },
        ],
    },
    {
        id: "BN-1051",
        name: "Le Hoang Nam",
        age: 58,
        gender: "Nam",
        phone: "0918 772 456",
        doctor: "BS. Tran Quoc Bao",
        latestVisit: "2026-04-10",
        riskLevel: "Nguy cơ trung bình",
        diagnosis: "Tổn thương nghi màng não vùng thái dương",
        visitCount: 3,
        note: "Cần đối chiếu thêm kết quả sinh thiết nếu có chỉ định.",
        visits: [
            {
                date: "2026-04-10",
                type: "Tái khám",
                finding: "Tổn thương tăng quang nhẹ, chưa có dấu hiệu chèn ép đáng kể.",
                impression: "Tiếp tục theo dõi đáp ứng điều trị và triệu chứng lâm sàng.",
            },
            {
                date: "2026-02-18",
                type: "Chẩn đoán hình ảnh",
                finding: "Khối ngoài trục ranh giới tương đối rõ vùng thái dương phải.",
                impression: "Ưu tiên theo dõi meningioma, cần đánh giá thêm mức độ xâm lấn.",
            },
            {
                date: "2026-01-05",
                type: "Khám ban đầu",
                finding: "Bệnh nhân chóng mặt, đau đầu từng cơn.",
                impression: "Chỉ định CT và MRI sọ não.",
            },
        ],
    },
    {
        id: "BN-1088",
        name: "Pham Gia Han",
        age: 35,
        gender: "Nữ",
        phone: "0982 555 902",
        doctor: "BS. Nguyen Hai Dang",
        latestVisit: "2026-04-15",
        riskLevel: "Ổn định",
        diagnosis: "Theo dõi sau điều trị u tuyến yên",
        visitCount: 5,
        note: "Hồ sơ theo dõi dài hạn với đáp ứng điều trị tích cực.",
        visits: [
            {
                date: "2026-04-15",
                type: "Tái khám",
                finding: "Không ghi nhận tái phát rõ trên hình ảnh hiện tại.",
                impression: "Duy trì lịch tái khám định kỳ mỗi 3 tháng.",
            },
            {
                date: "2026-02-12",
                type: "Theo dõi sau điều trị",
                finding: "Vùng sau mổ ổn định, không có phù nề mới.",
                impression: "Tiên lượng thuận lợi, tiếp tục theo dõi nội tiết.",
            },
            {
                date: "2025-11-30",
                type: "Đánh giá định kỳ",
                finding: "Mô còn lại kích thước nhỏ, không tiến triển.",
                impression: "Tiếp tục kiểm soát triệu chứng và theo dõi MRI.",
            },
            {
                date: "2025-08-16",
                type: "Sau phẫu thuật",
                finding: "Hậu phẫu ổn định, không biến chứng cấp tính.",
                impression: "Theo dõi phục hồi và đánh giá nội tiết.",
            },
            {
                date: "2025-07-05",
                type: "Khám ban đầu",
                finding: "Rối loạn thị giác, nghi tổn thương vùng tuyến yên.",
                impression: "Chỉ định MRI và xét nghiệm nội tiết.",
            },
        ],
    },
    {
        id: "BN-1102",
        name: "Doan Quoc Tuan",
        age: 63,
        gender: "Nam",
        phone: "0971 335 221",
        doctor: "BS. Nguyen Hai Dang",
        latestVisit: "2026-04-09",
        riskLevel: "Cảnh báo cao",
        diagnosis: "Khối choán chỗ nghi di căn não",
        visitCount: 2,
        note: "Cần phối hợp đa chuyên khoa để lên kế hoạch điều trị.",
        visits: [
            {
                date: "2026-04-09",
                type: "Đánh giá khẩn",
                finding: "Nhiều tổn thương tăng quang, phù quanh tổn thương rõ.",
                impression: "Nghi di căn não, cần hội chẩn ung bướu và thần kinh.",
            },
            {
                date: "2026-04-03",
                type: "Khám ban đầu",
                finding: "Đau đầu tăng dần, yếu nửa người thoáng qua.",
                impression: "Ưu tiên chụp MRI và đánh giá nguyên phát ngoài sọ.",
            },
        ],
    },
];

const riskStyles = {
    "Cảnh báo cao": "bg-rose-50 text-rose-700 border-rose-200",
    "Cần theo dõi sát": "bg-amber-50 text-amber-700 border-amber-200",
    "Nguy cơ trung bình": "bg-sky-50 text-sky-700 border-sky-200",
    "Ổn định": "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export default function Patient() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDoctor, setSelectedDoctor] = useState("Tất cả");
    const [selectedPatientId, setSelectedPatientId] = useState(patientRecords[0].id);

    const doctors = useMemo(() => {
        return ["Tất cả", ...new Set(patientRecords.map((patient) => patient.doctor))];
    }, []);

    const filteredPatients = useMemo(() => {
        return patientRecords.filter((patient) => {
            const matchesDoctor = selectedDoctor === "Tất cả" || patient.doctor === selectedDoctor;
            const keyword = searchTerm.trim().toLowerCase();
            const matchesSearch =
                !keyword ||
                patient.name.toLowerCase().includes(keyword) ||
                patient.id.toLowerCase().includes(keyword) ||
                patient.diagnosis.toLowerCase().includes(keyword);

            return matchesDoctor && matchesSearch;
        });
    }, [searchTerm, selectedDoctor]);

    const selectedPatient =
        filteredPatients.find((patient) => patient.id === selectedPatientId) || filteredPatients[0] || null;

    const totalVisits = filteredPatients.reduce((sum, patient) => sum + patient.visitCount, 0);
    const highRiskPatients = filteredPatients.filter(
        (patient) => patient.riskLevel === "Cảnh báo cao" || patient.riskLevel === "Cần theo dõi sát"
    ).length;

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
                                    <p className="mt-3 text-4xl font-bold text-white">{filteredPatients.length}</p>
                                    <p className="mt-2 text-sm text-slate-300">Tổng hồ sơ phù hợp với bộ lọc hiện tại.</p>
                                </div>
                                <div className="rounded-[24px] border border-white/10 bg-white/10 p-5 backdrop-blur">
                                    <p className="text-xs uppercase tracking-[0.24em] text-cyan-100/80">Tổng lượt thăm khám</p>
                                    <p className="mt-3 text-4xl font-bold text-white">{totalVisits}</p>
                                    <p className="mt-2 text-sm text-slate-300">Bao gồm toàn bộ các lần khám đã ghi nhận.</p>
                                </div>
                                <div className="rounded-[24px] border border-white/10 bg-white/10 p-5 backdrop-blur">
                                    <p className="text-xs uppercase tracking-[0.24em] text-cyan-100/80">Cần ưu tiên theo dõi</p>
                                    <p className="mt-3 text-4xl font-bold text-amber-300">{highRiskPatients}</p>
                                    <p className="mt-2 text-sm text-slate-300">Nhóm bệnh nhân có mức cảnh báo cao hơn.</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-4">
                            <div className="rounded-[28px] border border-white/10 bg-white/10 p-5 backdrop-blur">
                                <p className="text-sm font-medium text-cyan-100">Bộ lọc đang áp dụng</p>
                                <div className="mt-4 space-y-4">
                                    <div className="rounded-2xl bg-white/10 p-4">
                                        <p className="text-xs uppercase tracking-[0.24em] text-slate-300">Bác sĩ phụ trách</p>
                                        <p className="mt-2 text-2xl font-semibold text-white">{selectedDoctor}</p>
                                    </div>

                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <div className="rounded-2xl bg-white/5 p-4">
                                            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Bệnh nhân ưu tiên</p>
                                            <p className="mt-2 text-base font-semibold text-white">
                                                {filteredPatients.find(
                                                    (patient) =>
                                                        patient.riskLevel === "Cảnh báo cao" ||
                                                        patient.riskLevel === "Cần theo dõi sát"
                                                )?.name || "Chưa có trường hợp ưu tiên"}
                                            </p>
                                        </div>
                                        <div className="rounded-2xl bg-white/5 p-4">
                                            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Cập nhật gần nhất</p>
                                            <p className="mt-2 text-base font-semibold text-white">
                                                {selectedPatient?.latestVisit || "--"}
                                            </p>
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
                                    Lọc theo bác sĩ và tìm nhanh theo mã bệnh nhân, tên hoặc nhận định.
                                </p>
                            </div>

                            <div className="grid gap-3 md:grid-cols-[1fr_220px]">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(event) => setSearchTerm(event.target.value)}
                                    placeholder="Tìm theo tên bệnh nhân, mã hồ sơ hoặc chẩn đoán..."
                                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-400 focus:bg-white"
                                />

                                <select
                                    value={selectedDoctor}
                                    onChange={(event) => setSelectedDoctor(event.target.value)}
                                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-400 focus:bg-white"
                                >
                                    {doctors.map((doctor) => (
                                        <option key={doctor} value={doctor}>
                                            {doctor}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="rounded-2xl bg-slate-50 p-4">
                                <p className="text-sm text-slate-500">Bệnh nhân đang hiển thị</p>
                                <p className="mt-2 text-2xl font-bold text-slate-900">{filteredPatients.length}</p>
                            </div>
                            <div className="rounded-2xl bg-slate-50 p-4">
                                <p className="text-sm text-slate-500">Tổng số lần khám</p>
                                <p className="mt-2 text-2xl font-bold text-slate-900">{totalVisits}</p>
                            </div>
                            <div className="rounded-2xl bg-slate-50 p-4">
                                <p className="text-sm text-slate-500">Bệnh nhân nguy cơ cao</p>
                                <p className="mt-2 text-2xl font-bold text-rose-600">{highRiskPatients}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {filteredPatients.length > 0 ? (
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
                                                    <div className="flex flex-wrap items-center gap-3">
                                                        <h3 className="text-xl font-semibold text-slate-900">{patient.name}</h3>
                                                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                                                            {patient.id}
                                                        </span>
                                                        <span
                                                            className={`rounded-full border px-3 py-1 text-xs font-semibold ${riskStyles[patient.riskLevel]
                                                                }`}
                                                        >
                                                            {patient.riskLevel}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-slate-500">
                                                        {patient.gender}, {patient.age} tuổi • Bác sĩ phụ trách: {patient.doctor}
                                                    </p>
                                                    <p className="text-sm leading-6 text-slate-700">{patient.diagnosis}</p>
                                                </div>

                                                <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[290px]">
                                                    <div className="rounded-2xl bg-slate-50 p-3">
                                                        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Lần khám</p>
                                                        <p className="mt-2 text-lg font-bold text-slate-900">{patient.visitCount}</p>
                                                    </div>
                                                    <div className="rounded-2xl bg-slate-50 p-3">
                                                        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Gần nhất</p>
                                                        <p className="mt-2 text-sm font-semibold text-slate-900">{patient.latestVisit}</p>
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
                                            <h3 className="mt-2 text-xl font-semibold">{selectedPatient.diagnosis}</h3>
                                        </div>
                                        <span
                                            className={`rounded-full border px-3 py-1 text-xs font-semibold ${riskStyles[selectedPatient.riskLevel] || "bg-white/10 text-white border-white/20"
                                                }`}
                                        >
                                            {selectedPatient.riskLevel}
                                        </span>
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

                                    <div className="mt-4 rounded-2xl bg-white/5 p-4">
                                        <p className="text-sm text-slate-300">Ghi chú hồ sơ</p>
                                        <p className="mt-2 text-sm leading-6 text-slate-100">{selectedPatient.note}</p>
                                    </div>
                                </div>

                                <div className="grid gap-3 sm:grid-cols-3">
                                    <div className="rounded-2xl bg-slate-50 p-4">
                                        <p className="text-sm text-slate-500">Mã bệnh nhân</p>
                                        <p className="mt-2 font-semibold text-slate-900">{selectedPatient.id}</p>
                                    </div>
                                    <div className="rounded-2xl bg-slate-50 p-4">
                                        <p className="text-sm text-slate-500">Tuổi / giới tính</p>
                                        <p className="mt-2 font-semibold text-slate-900">
                                            {selectedPatient.age} / {selectedPatient.gender}
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

                                    <div className="mt-5 space-y-4">
                                        {selectedPatient.visits.map((visit, index) => (
                                            <div
                                                key={`${selectedPatient.id}-${visit.date}-${index}`}
                                                className="rounded-[24px] border border-slate-200 bg-slate-50 p-4"
                                            >
                                                <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
                                                    <div>
                                                        <p className="text-lg font-semibold text-slate-900">{visit.type}</p>
                                                        <p className="mt-1 text-sm text-slate-500">Ngày khám: {visit.date}</p>
                                                    </div>
                                                    <div className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm">
                                                        Lần khám {selectedPatient.visits.length - index}
                                                    </div>
                                                </div>

                                                <div className="mt-4 space-y-3">
                                                    <div className="rounded-2xl bg-white p-4">
                                                        <p className="text-sm text-slate-500">Kết quả ghi nhận</p>
                                                        <p className="mt-2 text-sm leading-6 text-slate-700">{visit.finding}</p>
                                                    </div>
                                                    <div className="rounded-2xl bg-white p-4">
                                                        <p className="text-sm text-slate-500">Nhận định của bác sĩ</p>
                                                        <p className="mt-2 text-sm leading-6 text-slate-700">{visit.impression}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
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
