import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
    ClipboardPlus,
    FileSearch,
    LayoutDashboard,
    Microscope,
    ChevronLeft,
    ChevronRight,
    Ruler,
    Search,
    ShieldCheck,
    Stethoscope,
    Users,
} from "lucide-react";
import { apiAdminViewPatient } from "../../axios/analy";
import SharedAdminSidebar from "../components/AdminSidebar";
import Header from "../header";

const pageStyles = `
.manage-patient-page {
    min-height: 100vh;
    padding: 24px;
    box-sizing: border-box;
    background:
        radial-gradient(circle at top left, rgba(32, 122, 196, 0.16), transparent 32%),
        linear-gradient(180deg, #f4f8fc 0%, #eef4f8 100%);
    font-family: "Segoe UI", sans-serif;
    color: #183b56;
}

.manage-patient-shell {
    display: grid;
    grid-template-columns: 280px minmax(0, 1fr);
    gap: 24px;
    align-items: start;
}

.manage-patient-sidebar {
    position: sticky;
    top: 24px;
    overflow: hidden;
    border-radius: 28px;
    padding: 24px 18px;
    background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.1), transparent 36%),
        linear-gradient(160deg, #123c69 0%, #0f2742 100%);
    box-shadow: 0 28px 60px rgba(18, 60, 105, 0.22);
    color: #fff;
}

.manage-patient-brand {
    margin-bottom: 24px;
    padding: 8px 8px 22px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}

.manage-patient-brand-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.12);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

.manage-patient-brand h2 {
    margin: 16px 0 8px;
    font-size: 28px;
    line-height: 1.1;
}

.manage-patient-brand p {
    margin: 0;
    color: rgba(255, 255, 255, 0.78);
    line-height: 1.6;
    font-size: 14px;
}

.manage-patient-nav-button {
    width: 100%;
    margin-bottom: 12px;
    border: 0;
    border-radius: 18px;
    padding: 14px 16px;
    background: transparent;
    color: inherit;
    display: flex;
    align-items: center;
    gap: 12px;
    text-align: left;
    cursor: pointer;
    transition: transform 0.18s ease, background 0.18s ease, box-shadow 0.18s ease;
}

.manage-patient-nav-button:hover {
    transform: translateX(2px);
    background: rgba(255, 255, 255, 0.08);
}

.manage-patient-nav-button.is-active {
    background: #fff;
    color: #123c69;
    box-shadow: 0 14px 28px rgba(7, 22, 39, 0.18);
}

.manage-patient-content {
    display: grid;
    gap: 22px;
}

.manage-patient-hero {
    position: relative;
    overflow: hidden;
    border-radius: 28px;
    padding: 28px;
    background:
        radial-gradient(circle at top right, rgba(15, 123, 108, 0.15), transparent 28%),
        linear-gradient(135deg, #ffffff 0%, #f5fbff 100%);
    border: 1px solid rgba(18, 60, 105, 0.08);
    box-shadow: 0 20px 50px rgba(12, 45, 72, 0.08);
}

.manage-patient-hero::after {
    content: "";
    position: absolute;
    right: -40px;
    top: -40px;
    width: 180px;
    height: 180px;
    border-radius: 50%;
    background: rgba(18, 60, 105, 0.06);
}

.manage-patient-hero-row {
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: space-between;
    gap: 20px;
    align-items: flex-start;
    flex-wrap: wrap;
}

.manage-patient-hero-copy {
    max-width: 760px;
}

.manage-patient-kicker {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 14px;
    padding: 8px 12px;
    border-radius: 999px;
    background: #ebf5ff;
    color: #175cd3;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
}

.manage-patient-hero h1 {
    margin: 0;
    font-size: 34px;
    line-height: 1.15;
    color: #123c69;
}

.manage-patient-hero p {
    margin: 12px 0 0;
    max-width: 700px;
    color: #526477;
    line-height: 1.7;
    font-size: 15px;
}

.manage-patient-hero-note {
    min-width: 240px;
    border-radius: 22px;
    padding: 18px 20px;
    background: linear-gradient(180deg, #123c69 0%, #17497c 100%);
    color: #fff;
    box-shadow: 0 18px 32px rgba(18, 60, 105, 0.18);
}

.manage-patient-hero-note strong {
    display: block;
    margin-bottom: 8px;
    font-size: 28px;
}

.manage-patient-hero-note span {
    color: rgba(255, 255, 255, 0.78);
    line-height: 1.5;
    font-size: 14px;
}

.manage-patient-main-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.65fr) minmax(330px, 0.95fr);
    gap: 22px;
    align-items: start;
}

.manage-patient-card {
    border-radius: 28px;
    padding: 24px;
    background: rgba(255, 255, 255, 0.94);
    border: 1px solid rgba(18, 60, 105, 0.08);
    box-shadow: 0 20px 50px rgba(12, 45, 72, 0.08);
}

.manage-patient-card-header {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    align-items: flex-start;
    flex-wrap: wrap;
    margin-bottom: 18px;
}

.manage-patient-card-header h3 {
    margin: 0 0 6px;
    font-size: 24px;
    color: #123c69;
}

.manage-patient-card-header p {
    margin: 0;
    color: #6a7d90;
    line-height: 1.6;
    font-size: 14px;
}

.manage-patient-tools {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}

.manage-patient-search {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: min(100%, 360px);
    padding: 12px 14px;
    border-radius: 16px;
    border: 1px solid #d9e5f2;
    background: #f9fbfd;
}

.manage-patient-search input {
    border: 0;
    outline: none;
    background: transparent;
    color: #183b56;
    min-width: 0;
    font-size: 14px;
    width: 100%;
}

.manage-patient-table-wrap {
    overflow: hidden;
    border-radius: 22px;
    border: 1px solid #e6edf5;
    background: #fff;
}

.manage-patient-table {
    width: 100%;
    border-collapse: collapse;
}

.manage-patient-table th {
    padding: 15px 18px;
    text-align: left;
    background: #f6faff;
    color: #5c7185;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
}

.manage-patient-table td {
    padding: 18px;
    border-top: 1px solid #edf3f8;
    color: #203242;
    vertical-align: top;
}

.manage-patient-table tbody tr {
    cursor: pointer;
    transition: background 0.18s ease;
}

.manage-patient-table tbody tr:hover {
    background: #f8fbff;
}

.manage-patient-table tbody tr.is-selected {
    background: linear-gradient(90deg, rgba(23, 92, 211, 0.08), rgba(15, 123, 108, 0.04));
}

.manage-patient-id {
    color: #123c69;
}

.manage-patient-name {
    min-width: 150px;
    font-weight: 600;
    color: #163a59;
}

.manage-patient-description {
    max-width: 260px;
    color: #53687d;
    line-height: 1.6;
}

.manage-patient-area-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border-radius: 999px;
    background: #eff8ff;
    color: #175cd3;
    font-size: 13px;
    font-weight: 700;
}

.manage-patient-empty {
    padding: 48px 20px;
    text-align: center;
    color: #66788b;
}

.manage-patient-state {
    border-radius: 18px;
    padding: 14px 16px;
    margin-bottom: 18px;
    font-size: 14px;
    line-height: 1.6;
}

.manage-patient-state.loading {
    background: #eef6ff;
    color: #175cd3;
}

.manage-patient-state.error {
    background: #fff1f0;
    color: #b42318;
}

.manage-patient-preview {
    display: grid;
    gap: 18px;
}

.manage-patient-preview-top {
    display: flex;
    align-items: flex-start;
    gap: 16px;
}

.manage-patient-preview-icon {
    width: 56px;
    height: 56px;
    border-radius: 18px;
    display: grid;
    place-items: center;
    flex-shrink: 0;
    background: linear-gradient(135deg, #123c69 0%, #0f7b6c 100%);
    color: #fff;
}

.manage-patient-preview h3 {
    margin: 0;
    font-size: 22px;
    color: #123c69;
}

.manage-patient-preview p {
    margin: 6px 0 0;
    color: #607487;
    line-height: 1.6;
    font-size: 14px;
}

.manage-patient-highlight {
    display: grid;
    gap: 14px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
}

.manage-patient-highlight-card {
    border-radius: 20px;
    padding: 16px;
    background: linear-gradient(180deg, #f6fbff 0%, #ffffff 100%);
    border: 1px solid #e1edf8;
}

.manage-patient-highlight-card span {
    display: block;
    margin-bottom: 8px;
    color: #698092;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
}

.manage-patient-highlight-card strong {
    display: block;
    color: #163a59;
    font-size: 22px;
    line-height: 1.25;
}

.manage-patient-detail-list {
    display: grid;
    gap: 12px;
}

.manage-patient-detail-item {
    border-radius: 18px;
    padding: 14px 16px;
    background: #f8fbfd;
    border: 1px solid #e8eef5;
}

.manage-patient-detail-label {
    display: block;
    margin-bottom: 6px;
    color: #698092;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
}

.manage-patient-detail-value {
    color: #203242;
    line-height: 1.7;
    font-size: 15px;
    word-break: break-word;
}

.manage-patient-preview-footer {
    border-radius: 20px;
    padding: 16px 18px;
    background: linear-gradient(180deg, #edf8ff 0%, #f7fbff 100%);
    border: 1px solid #d9ebfa;
}

.manage-patient-preview-footer p {
    margin: 0;
    color: #54708a;
    line-height: 1.7;
}

.manage-patient-pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 14px;
    flex-wrap: wrap;
    margin-top: 18px;
}

.manage-patient-pagination-info {
    color: #607487;
    font-size: 14px;
}

.manage-patient-pagination-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
}

.manage-patient-page-button {
    border: 1px solid #dbe7f3;
    background: #ffffff;
    color: #123c69;
    border-radius: 14px;
    padding: 10px 14px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.18s ease, border-color 0.18s ease, opacity 0.18s ease;
}

.manage-patient-page-button:hover:not(:disabled) {
    background: #f5faff;
    border-color: #bfd4ea;
}

.manage-patient-page-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.manage-patient-page-current {
    padding: 10px 14px;
    border-radius: 14px;
    background: #eff6ff;
    color: #175cd3;
    font-size: 14px;
    font-weight: 700;
}

@media (max-width: 1180px) {
    .manage-patient-shell,
    .manage-patient-main-grid {
        grid-template-columns: 1fr;
    }

    .manage-patient-sidebar {
        position: static;
    }
}

@media (max-width: 720px) {
    .manage-patient-page {
        padding: 16px;
    }

    .manage-patient-hero,
    .manage-patient-card,
    .manage-patient-sidebar {
        border-radius: 22px;
        padding: 20px;
    }

    .manage-patient-hero h1 {
        font-size: 28px;
    }

    .manage-patient-tools,
    .manage-patient-highlight {
        width: 100%;
        display: grid;
        grid-template-columns: 1fr;
    }

    .manage-patient-table-wrap {
        overflow-x: auto;
    }

    .manage-patient-table {
        min-width: 980px;
    }
}
`;

const sidebarItems = [
    { label: "Thống kê", path: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Quản lý người dùng", path: "/admin", icon: Users },
    { label: "Quản lý bệnh án", path: "/admin/patients", icon: ClipboardPlus },
    { label: "Quản lý role", path: "/admin/roles", icon: ShieldCheck },
];

const fallbackRecords = [
    {
        id_result_patient: "BA-001",
        name_type: "Glioma",
        area: 1240,
        description: "Khoi u co kich thuoc lon, can theo doi sat va danh gia them.",
        doctor_name: "Tran Thi Binh",
    },
    {
        id_result_patient: "BA-002",
        name_type: "Meningioma",
        area: 860,
        description: "Ton thuong ro, bien dang tap trung o vung trung tam.",
        doctor_name: "Nguyen Van An",
    },
    {
        id_result_patient: "BA-003",
        name_type: "Pituitary Tumor",
        area: 615,
        description: "Can doi chieu voi ket qua cu va de xuat tai kham.",
        doctor_name: "Tran Thi Binh",
    },
];

const AdminSidebar = () => {
    return (
        <SharedAdminSidebar
            title="Benh an"
            description="Man hinh nay duoc toi uu de xem nhanh ket qua benh an theo dung cac truong du lieu ban can."
        />
    );
};

const mapRecordsFromApi = (patients, defaultDoctorName) => {
    return (patients || []).map((item, index) => ({
        id_result_patient: item?.id_result_patient || item?.id || `BA-${index + 1}`,
        name_type:
            item?.name_type ||
            item?.nameType ||
            item?.typeName ||
            item?.addInfor?.name_type ||
            item?.addInfor?.nameType ||
            "Chua cap nhat",
        area: item?.area ?? "--",
        description:
            item?.description ||
            item?.desceiption ||
            item?.addInfor?.description ||
            item?.addInfor?.desceiption ||
            "Chua co mo ta cho ket qua nay.",
        doctor_name:
            item?.doctor_name ||
            item?.doctorName ||
            item?.addInfor?.doctor_name ||
            item?.addInfor?.doctorName ||
            defaultDoctorName ||
            "Chua cap nhat",
    }));
};

const formatArea = (value) => {
    if (value === null || value === undefined || value === "") {
        return "--";
    }

    return `${value} px`;
};

const DetailItem = ({ label, value }) => (
    <div className="manage-patient-detail-item">
        <span className="manage-patient-detail-label">{label}</span>
        <div className="manage-patient-detail-value">{value || "--"}</div>
    </div>
);

const ManagePatient = () => {
    const accessToken = useSelector((state) => state.user.user.accessToken);
    const accountName = useSelector((state) => state.user.user.name);
    const [records, setRecords] = useState(fallbackRecords);
    const [selectedId, setSelectedId] = useState(fallbackRecords[0]?.id_result_patient || "");
    const [keyword, setKeyword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalObj, setTotalObj] = useState(fallbackRecords.length);
    const [hasNextPage, setHasNextPage] = useState(false);
    const pageSize = 5;

    useEffect(() => {
        const fetchPatientRecords = async () => {
            if (!accessToken) {
                setRecords(fallbackRecords);
                setSelectedId((currentId) => currentId || fallbackRecords[0]?.id_result_patient || "");
                setCurrentPage(1);
                setTotalPages(1);
                setTotalObj(fallbackRecords.length);
                setHasNextPage(false);
                return;
            }

            try {
                setIsLoading(true);
                setErrorMessage("");

                const response = await apiAdminViewPatient(accessToken, currentPage, pageSize);
                const payload = response?.data?.message ?? response?.data ?? [];
                const list =
                    payload?.allPatient ||
                    payload?.patients ||
                    payload?.results ||
                    payload?.data ||
                    (Array.isArray(payload) ? payload : []);
                const mappedRecords = mapRecordsFromApi(list, accountName);
                const rawTotalPages = payload?.totalPages;
                const rawTotalObj = payload?.totalObj;
                const nextTotalPages = Number(rawTotalPages ?? 1);
                const nextTotalObj = Number(rawTotalObj ?? mappedRecords.length);
                const hasServerPagination = rawTotalPages !== undefined || rawTotalObj !== undefined;

                if (mappedRecords.length) {
                    setRecords(mappedRecords);
                    setSelectedId((currentId) =>
                        mappedRecords.some((item) => item.id_result_patient === currentId)
                            ? currentId
                            : mappedRecords[0].id_result_patient
                    );
                } else {
                    setRecords([]);
                    setSelectedId("");
                }

                setTotalPages(hasServerPagination ? (nextTotalPages > 0 ? nextTotalPages : 1) : Math.max(currentPage, 1));
                setTotalObj(
                    hasServerPagination
                        ? (nextTotalObj >= 0 ? nextTotalObj : mappedRecords.length)
                        : (currentPage - 1) * pageSize + mappedRecords.length + (mappedRecords.length === pageSize ? 1 : 0)
                );
                setHasNextPage(hasServerPagination ? currentPage < (nextTotalPages > 0 ? nextTotalPages : 1) : mappedRecords.length === pageSize);
            } catch (error) {
                setRecords(fallbackRecords);
                setSelectedId(fallbackRecords[0]?.id_result_patient || "");
                setTotalPages(1);
                setTotalObj(fallbackRecords.length);
                setHasNextPage(false);
                setErrorMessage(
                    error?.response?.data?.message ||
                    error?.response?.data?.detail ||
                    "Khong the tai danh sach benh an tu he thong. Dang hien thi du lieu mau."
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchPatientRecords();
    }, [accessToken, accountName, currentPage]);

    const filteredRecords = useMemo(() => {
        const normalizedKeyword = keyword.trim().toLowerCase();

        return records.filter((item) => {
            if (!normalizedKeyword) {
                return true;
            }

            return [
                item.id_result_patient,
                item.name_type,
                item.description,
                item.doctor_name,
                String(item.area ?? ""),
            ]
                .filter(Boolean)
                .some((value) => value.toLowerCase().includes(normalizedKeyword));
        });
    }, [keyword, records]);

    const selectedRecord = useMemo(() => {
        if (!filteredRecords.length) {
            return null;
        }

        return filteredRecords.find((item) => item.id_result_patient === selectedId) || filteredRecords[0];
    }, [filteredRecords, selectedId]);

    const showingFrom = filteredRecords.length ? (currentPage - 1) * pageSize + 1 : 0;
    const showingTo = filteredRecords.length ? showingFrom + filteredRecords.length - 1 : 0;
    const canGoNext = hasNextPage && !isLoading;
    const canGoPrev = currentPage > 1 && !isLoading;

    return (
        <div className="manage-patient-page">
            <style>{pageStyles}</style>

            <div className="manage-patient-shell">
                <AdminSidebar />

                <main className="manage-patient-content">
                    <Header />

                    <section className="manage-patient-hero">
                        <div className="manage-patient-hero-row">
                            <div className="manage-patient-hero-copy">
                                <div className="manage-patient-kicker">
                                    <FileSearch size={14} />
                                    Bệnh án
                                </div>
                                <h1>Quản lý hồ sơ bệnh án</h1>
                                <p>
                                    Cho phép bạn theo dõi và quản lý các hồ sơ bệnh án một cách hiệu quả.
                                </p>
                            </div>

                            <div className="manage-patient-hero-note">
                                <strong>{filteredRecords.length}</strong>
                                <span>Bản ghi bệnh án đang hiển thị trong danh sách hiện tại.</span>
                            </div>
                        </div>
                    </section>

                    <section className="manage-patient-main-grid">
                        <div className="manage-patient-card">
                            <div className="manage-patient-card-header">
                                <div>
                                    <h3>Danh sách bệnh án</h3>
                                    <p>Mỗi dòng là kết quả, có thể nhấn vào để xem chi tiết</p>
                                </div>


                            </div>

                            {isLoading ? <div className="manage-patient-state loading">Dang tai du lieu benh an...</div> : null}
                            {errorMessage ? <div className="manage-patient-state error">{errorMessage}</div> : null}

                            <div className="manage-patient-table-wrap">
                                <table className="manage-patient-table">
                                    <thead>
                                        <tr>
                                            <th>Mã bệnh án</th>
                                            <th>Tên bệnh án</th>
                                            <th>Diện tích</th>
                                            <th>Miêu tả</th>
                                            <th>Bác sĩ phụ trách</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredRecords.length ? (
                                            filteredRecords.map((item) => (
                                                <tr
                                                    key={item.id_result_patient}
                                                    onClick={() => setSelectedId(item.id_result_patient)}
                                                    className={selectedRecord?.id_result_patient === item.id_result_patient ? "is-selected" : ""}
                                                >
                                                    <td className="manage-patient-id">{item.id_result_patient}</td>
                                                    <td className="manage-patient-name">{item.name_type}</td>
                                                    <td>
                                                        <span className="manage-patient-area-pill">
                                                            <Ruler size={14} />
                                                            {formatArea(item.area)}
                                                        </span>
                                                    </td>
                                                    <td className="manage-patient-description">{item.description}</td>
                                                    <td>{item.doctor_name}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="manage-patient-empty">
                                                    Khong tim thay benh an phu hop voi tu khoa hien tai.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="manage-patient-pagination">
                                <div className="manage-patient-pagination-info">
                                    Hien thi {showingFrom}-{showingTo} / {totalObj} benh an
                                </div>

                                <div className="manage-patient-pagination-actions">
                                    <button
                                        type="button"
                                        className="manage-patient-page-button"
                                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                        disabled={!canGoPrev}
                                    >
                                        <ChevronLeft size={16} />
                                        Trang truoc
                                    </button>

                                    <div className="manage-patient-page-current">
                                        Trang {currentPage} / {totalPages}
                                    </div>

                                    <button
                                        type="button"
                                        className="manage-patient-page-button"
                                        onClick={() => setCurrentPage((prev) => prev + 1)}
                                        disabled={!canGoNext}
                                    >
                                        Trang sau
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <aside className="manage-patient-card">
                            {selectedRecord ? (
                                <div className="manage-patient-preview">
                                    <div className="manage-patient-preview-top">
                                        <div className="manage-patient-preview-icon">
                                            <Microscope size={24} />
                                        </div>

                                        <div>
                                            <h3 style={{ "color": 'red' }}>{selectedRecord.name_type}</h3>
                                            <p>Bạn có thể xem chi tiết tại đây.</p>
                                        </div>
                                    </div>

                                    <div className="manage-patient-highlight">
                                        <div className="manage-patient-highlight-card">
                                            <span>Mã bệnh án</span>
                                            <strong>{selectedRecord.id_result_patient}</strong>
                                        </div>

                                        <div className="manage-patient-highlight-card">
                                            <span>Diện tích</span>
                                            <strong>{formatArea(selectedRecord.area)}</strong>
                                        </div>
                                    </div>

                                    <div className="manage-patient-detail-list">
                                        <DetailItem label="Tên bệnh án" value={selectedRecord.name_type} />
                                        <DetailItem label="BÁc sĩ phụ trách" value={selectedRecord.doctor_name} />
                                        <DetailItem label="Miêu tả" value={selectedRecord.description} />
                                    </div>


                                </div>
                            ) : (
                                <div className="manage-patient-empty">Chua co du lieu benh an de hien thi.</div>
                            )}
                        </aside>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default ManagePatient;
