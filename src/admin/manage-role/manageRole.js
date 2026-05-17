import { useEffect, useMemo, useState } from "react";
import {
    ClipboardList,
    FileText,
    LayoutDashboard,
    Search,
    ShieldCheck,
    Stethoscope,
    Users,
} from "lucide-react";
import { useSelector } from "react-redux";
import { fetchAllRoles } from "../../axios/role";
import SharedAdminSidebar from "../components/AdminSidebar";
import Header from "../header";

const pageStyles = `
.manage-role-page {
    min-height: 100vh;
    padding: 24px;
    box-sizing: border-box;
    background:
        radial-gradient(circle at top left, rgba(32, 122, 196, 0.14), transparent 32%),
        linear-gradient(180deg, #f4f8fc 0%, #eef4f8 100%);
    font-family: "Segoe UI", sans-serif;
    color: #183b56;
}

.manage-role-shell {
    display: grid;
    grid-template-columns: 280px minmax(0, 1fr);
    gap: 24px;
    align-items: start;
}

.manage-role-sidebar {
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

.manage-role-brand {
    margin-bottom: 24px;
    padding: 8px 8px 22px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}

.manage-role-brand-badge {
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

.manage-role-brand h2 {
    margin: 16px 0 8px;
    font-size: 28px;
    line-height: 1.1;
}

.manage-role-brand p {
    margin: 0;
    color: rgba(255, 255, 255, 0.78);
    line-height: 1.6;
    font-size: 14px;
}

.manage-role-nav-button {
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

.manage-role-nav-button:hover {
    transform: translateX(2px);
    background: rgba(255, 255, 255, 0.08);
}

.manage-role-nav-button.is-active {
    background: #fff;
    color: #123c69;
    box-shadow: 0 14px 28px rgba(7, 22, 39, 0.18);
}

.manage-role-content {
    display: grid;
    gap: 22px;
}

.manage-role-hero {
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

.manage-role-hero-row {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    align-items: flex-start;
    flex-wrap: wrap;
}

.manage-role-kicker {
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

.manage-role-hero h1 {
    margin: 0;
    font-size: 34px;
    line-height: 1.15;
    color: #123c69;
}

.manage-role-hero p {
    margin: 12px 0 0;
    max-width: 700px;
    color: #526477;
    line-height: 1.7;
    font-size: 15px;
}

.manage-role-hero-note {
    min-width: 220px;
    border-radius: 22px;
    padding: 18px 20px;
    background: linear-gradient(180deg, #123c69 0%, #17497c 100%);
    color: #fff;
    box-shadow: 0 18px 32px rgba(18, 60, 105, 0.18);
}

.manage-role-hero-note strong {
    display: block;
    margin-bottom: 8px;
    font-size: 28px;
}

.manage-role-hero-note span {
    color: rgba(255, 255, 255, 0.78);
    line-height: 1.5;
    font-size: 14px;
}

.manage-role-main-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.55fr) minmax(320px, 0.95fr);
    gap: 22px;
    align-items: start;
}

.manage-role-card {
    border-radius: 28px;
    padding: 24px;
    background: rgba(255, 255, 255, 0.94);
    border: 1px solid rgba(18, 60, 105, 0.08);
    box-shadow: 0 20px 50px rgba(12, 45, 72, 0.08);
}

.manage-role-card-header {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    align-items: flex-start;
    flex-wrap: wrap;
    margin-bottom: 18px;
}

.manage-role-card-header h3 {
    margin: 0 0 6px;
    font-size: 24px;
    color: #123c69;
}

.manage-role-card-header p {
    margin: 0;
    color: #6a7d90;
    line-height: 1.6;
    font-size: 14px;
}

.manage-role-search {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: min(100%, 360px);
    padding: 12px 14px;
    border-radius: 16px;
    border: 1px solid #d9e5f2;
    background: #f9fbfd;
}

.manage-role-search input {
    border: 0;
    outline: none;
    background: transparent;
    color: #183b56;
    min-width: 0;
    font-size: 14px;
    width: 100%;
}

.manage-role-table-wrap {
    overflow: hidden;
    border-radius: 22px;
    border: 1px solid #e6edf5;
    background: #fff;
}

.manage-role-table {
    width: 100%;
    border-collapse: collapse;
}

.manage-role-table th {
    padding: 15px 18px;
    text-align: left;
    background: #f6faff;
    color: #5c7185;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
}

.manage-role-table td {
    padding: 18px;
    border-top: 1px solid #edf3f8;
    color: #203242;
    vertical-align: top;
}

.manage-role-table tbody tr {
    cursor: pointer;
    transition: background 0.18s ease;
}

.manage-role-table tbody tr:hover {
    background: #f8fbff;
}

.manage-role-table tbody tr.is-selected {
    background: linear-gradient(90deg, rgba(23, 92, 211, 0.08), rgba(15, 123, 108, 0.04));
}

.manage-role-name {
    color: #163a59;
    font-weight: 600;
}

.manage-role-description {
    max-width: 420px;
    color: #53687d;
    line-height: 1.6;
}

.manage-role-empty {
    padding: 48px 20px;
    text-align: center;
    color: #66788b;
}

.manage-role-preview {
    display: grid;
    gap: 18px;
}

.manage-role-preview-top {
    display: flex;
    align-items: flex-start;
    gap: 16px;
}

.manage-role-preview-icon {
    width: 56px;
    height: 56px;
    border-radius: 18px;
    display: grid;
    place-items: center;
    flex-shrink: 0;
    background: linear-gradient(135deg, #123c69 0%, #0f7b6c 100%);
    color: #fff;
}

.manage-role-preview h3 {
    margin: 0;
    font-size: 22px;
    color: #123c69;
}

.manage-role-preview p {
    margin: 6px 0 0;
    color: #607487;
    line-height: 1.6;
    font-size: 14px;
}

.manage-role-detail-list {
    display: grid;
    gap: 12px;
}

.manage-role-detail-item {
    border-radius: 18px;
    padding: 14px 16px;
    background: #f8fbfd;
    border: 1px solid #e8eef5;
}

.manage-role-detail-label {
    display: block;
    margin-bottom: 6px;
    color: #698092;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
}

.manage-role-detail-value {
    color: #203242;
    line-height: 1.7;
    font-size: 15px;
    word-break: break-word;
}

.manage-role-preview-footer {
    border-radius: 20px;
    padding: 16px 18px;
    background: linear-gradient(180deg, #edf8ff 0%, #f7fbff 100%);
    border: 1px solid #d9ebfa;
}

.manage-role-preview-footer p {
    margin: 0;
    color: #54708a;
    line-height: 1.7;
}

@media (max-width: 1180px) {
    .manage-role-shell,
    .manage-role-main-grid {
        grid-template-columns: 1fr;
    }

    .manage-role-sidebar {
        position: static;
    }
}

@media (max-width: 720px) {
    .manage-role-page {
        padding: 16px;
    }

    .manage-role-hero,
    .manage-role-card,
    .manage-role-sidebar {
        border-radius: 22px;
        padding: 20px;
    }

    .manage-role-hero h1 {
        font-size: 28px;
    }

    .manage-role-table-wrap {
        overflow-x: auto;
    }

    .manage-role-table {
        min-width: 760px;
    }
}
`;

const sidebarItems = [
    { label: "Thống kê", path: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Quản lý người dùng", path: "/admin", icon: Users },
    { label: "Quản lý bệnh án", path: "/admin/patients", icon: FileText },
    { label: "Quản lý role", path: "/admin/roles", icon: ShieldCheck },
];

const roleData = [
    {
        idRole: "ROL-01",
        name: "admin",
        description: "Toan quyen quan tri he thong, nguoi dung va cac phan he chuc nang.",
    },
    {
        idRole: "ROL-02",
        name: "doctor",
        description: "Theo doi benh an, cap nhat ket qua kham va xu ly thong tin lien quan den dieu tri.",
    },
    {
        idRole: "ROL-03",
        name: "receptionist",
        description: "Ho tro tiep nhan, cap nhat thong tin co ban va dieu phoi quy trinh lam viec dau vao.",
    },
];

const AdminSidebar = () => {
    return (
        <SharedAdminSidebar
            title="Role"
            description="Khu vuc nay duoc thiet ke lai de quan tri role ro rang hon va bam sat dung cau truc field."
        />
    );
};

const DetailItem = ({ label, value }) => (
    <div className="manage-role-detail-item">
        <span className="manage-role-detail-label">{label}</span>
        <div className="manage-role-detail-value">{value || "--"}</div>
    </div>
);

const ManageRole = () => {
    const accessToken = useSelector((state) => state.user.user.accessToken);
    const [keyword, setKeyword] = useState("");
    const [roles, setRoles] = useState(roleData);
    const [selectedId, setSelectedId] = useState(roleData[0]?.idRole || "");

    useEffect(() => {
        const getAllRoles = async () => {
            if (!accessToken) {
                setRoles(roleData);
                setSelectedId((currentId) => currentId || roleData[0]?.idRole || "");
                return;
            }

            try {
                const rs = await fetchAllRoles(accessToken);
                const payload = rs?.data?.message ?? rs?.data ?? [];
                const nextRoles = Array.isArray(payload) ? payload : [];

                console.log("All roles:", nextRoles);

                if (nextRoles.length) {
                    setRoles(nextRoles);
                    setSelectedId((currentId) =>
                        nextRoles.some((item) => item.idRole === currentId)
                            ? currentId
                            : nextRoles[0]?.idRole || ""
                    );
                } else {
                    setRoles([]);
                    setSelectedId("");
                }
            } catch (error) {
                setRoles(roleData);
                setSelectedId((currentId) => currentId || roleData[0]?.idRole || "");
            }
        };

        getAllRoles();
    }, [accessToken]);

    const filteredRoles = useMemo(() => {
        const normalizedKeyword = keyword.trim().toLowerCase();

        return roles.filter((item) => {
            if (!normalizedKeyword) {
                return true;
            }

            return [item.idRole, item.name, item.description]
                .filter(Boolean)
                .some((value) => value.toLowerCase().includes(normalizedKeyword));
        });
    }, [keyword, roles]);

    const selectedRole = useMemo(() => {
        if (!filteredRoles.length) {
            return null;
        }

        return filteredRoles.find((item) => item.idRole === selectedId) || filteredRoles[0];
    }, [filteredRoles, selectedId]);

    return (
        <div className="manage-role-page">
            <style>{pageStyles}</style>

            <div className="manage-role-shell">
                <AdminSidebar />

                <main className="manage-role-content">
                    <Header />

                    <section className="manage-role-hero">
                        <div className="manage-role-hero-row">
                            <div>
                                <div className="manage-role-kicker">
                                    <ClipboardList size={14} />
                                    Vai trò
                                </div>
                                <h1>Danh sách vai trò</h1>
                                <p>Trang hiển thị danh sách vai trò trong hệ thống.</p>
                            </div>

                            <div className="manage-role-hero-note">
                                <strong>{filteredRoles.length}</strong>
                                <span>Role dang hien thi theo bo loc hien tai.</span>
                            </div>
                        </div>
                    </section>

                    <section className="manage-role-main-grid">
                        <div className="manage-role-card">
                            <div className="manage-role-card-header">
                                <div>
                                    <h3>Bảng vai trò</h3>
                                    <p>Bạn có thể bấm vào role bất kỳ để xem chi tiết</p>
                                </div>


                            </div>

                            <div className="manage-role-table-wrap">
                                <table className="manage-role-table">
                                    <thead>
                                        <tr>
                                            <th>Mã vai trò</th>
                                            <th>Tên vai trò</th>
                                            <th>Miêu tả</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredRoles.length ? (
                                            filteredRoles.map((item) => (
                                                <tr
                                                    key={item.idRole}
                                                    onClick={() => setSelectedId(item.idRole)}
                                                    className={selectedRole?.idRole === item.idRole ? "is-selected" : ""}
                                                >
                                                    <td>{item.idRole}</td>
                                                    <td className="manage-role-name">{item.name}</td>
                                                    <td className="manage-role-description">{item.description}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" className="manage-role-empty">
                                                    Khong tim thay role phu hop voi tu khoa hien tai.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <aside className="manage-role-card">
                            {selectedRole ? (
                                <div className="manage-role-preview">
                                    <div className="manage-role-preview-top">
                                        <div className="manage-role-preview-icon">
                                            <ShieldCheck size={24} />
                                        </div>

                                        <div>
                                            <h3>{selectedRole.name}</h3>
                                            <p>Bạn có thể xem kĩ hơn tại ô bên dưới.</p>
                                        </div>
                                    </div>

                                    <div className="manage-role-detail-list">
                                        <DetailItem label="Mã vai trò" value={selectedRole.idRole} />
                                        <DetailItem label="Tên vai trò" value={selectedRole.name} />
                                        <DetailItem label="Miêu tả" value={selectedRole.description} />
                                    </div>

                                    <div className="manage-role-preview-footer">
                                        <p>Mapping dang dung la: `idRole`, `name`, `description`.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="manage-role-empty">Chua co role nao de hien thi.</div>
                            )}
                        </aside>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default ManageRole;
