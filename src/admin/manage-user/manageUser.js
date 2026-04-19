import { useEffect, useMemo, useState } from "react";
import { Eye, FileText, LayoutDashboard, Pencil, Plus, ShieldCheck, Trash2, UserCog, Users } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import TableUsers from "./tableUser";
import CreateUser from "./createUser";
import { apiCreateUser } from "../../axios/user";

const adminShellStyles = {
    page: {
        minHeight: "100vh",
        background: "linear-gradient(135deg, #eef6ff 0%, #f8fbff 55%, #ffffff 100%)",
        padding: "24px",
        boxSizing: "border-box",
        fontFamily: "'Segoe UI', sans-serif",
    },
    shell: {
        display: "grid",
        gridTemplateColumns: "280px 1fr",
        gap: "24px",
        alignItems: "start",
    },
    sidebar: {
        background: "linear-gradient(180deg, #123c69 0%, #0f2f52 100%)",
        color: "#ffffff",
        borderRadius: "24px",
        padding: "24px 20px",
        boxShadow: "0 24px 60px rgba(18, 60, 105, 0.20)",
        position: "sticky",
        top: "24px",
    },
    brand: {
        marginBottom: "24px",
        paddingBottom: "20px",
        borderBottom: "1px solid rgba(255,255,255,0.14)",
    },
    brandTitle: {
        fontSize: "24px",
        fontWeight: 700,
        marginBottom: "8px",
    },
    brandText: {
        margin: 0,
        color: "rgba(255,255,255,0.72)",
        lineHeight: 1.5,
        fontSize: "14px",
    },
    menuButton: {
        width: "100%",
        border: "none",
        borderRadius: "18px",
        padding: "16px",
        color: "#ffffff",
        background: "transparent",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        cursor: "pointer",
        textAlign: "left",
        marginBottom: "12px",
    },
    content: {
        display: "grid",
        gap: "20px",
    },
    hero: {
        background: "#ffffff",
        borderRadius: "24px",
        padding: "24px",
        boxShadow: "0 20px 50px rgba(12, 45, 72, 0.08)",
        display: "flex",
        justifyContent: "space-between",
        gap: "16px",
        flexWrap: "wrap",
    },
    heroTitle: {
        margin: 0,
        color: "#123c69",
        fontSize: "30px",
        fontWeight: 700,
    },
    heroText: {
        margin: "8px 0 0",
        color: "#5b6b7a",
        lineHeight: 1.6,
        maxWidth: "720px",
    },
    summaryWrap: {
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(150px, 1fr))",
        gap: "12px",
        width: "100%",
    },
    summaryCard: {
        background: "#f3f8ff",
        border: "1px solid #dceafb",
        borderRadius: "18px",
        padding: "16px",
    },
    summaryLabel: {
        display: "block",
        fontSize: "13px",
        color: "#5f7285",
        marginBottom: "8px",
    },
    summaryValue: {
        fontSize: "28px",
        fontWeight: 700,
        color: "#123c69",
    },
    panel: {
        background: "#ffffff",
        borderRadius: "24px",
        padding: "24px",
        boxShadow: "0 20px 50px rgba(12, 45, 72, 0.08)",
    },
    panelHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "16px",
        flexWrap: "wrap",
        marginBottom: "20px",
    },
    panelTitle: {
        margin: 0,
        color: "#123c69",
        fontSize: "24px",
        fontWeight: 700,
    },
    actionGroup: {
        display: "flex",
        gap: "12px",
        flexWrap: "wrap",
    },
    actionButton: {
        border: "none",
        borderRadius: "14px",
        padding: "12px 16px",
        fontWeight: 600,
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
    },
    primaryButton: {
        background: "#0f7b6c",
        color: "#ffffff",
    },
    secondaryButton: {
        background: "#f2f7fb",
        color: "#123c69",
    },
    dangerButton: {
        background: "#fff1f0",
        color: "#b42318",
    },
    tableWrap: {
        overflowX: "auto",
        border: "1px solid #e4edf7",
        borderRadius: "20px",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        minWidth: "760px",
    },
    th: {
        textAlign: "left",
        padding: "16px",
        background: "#f5f9ff",
        color: "#5f7285",
        fontSize: "13px",
        textTransform: "uppercase",
        letterSpacing: "0.04em",
    },
    td: {
        padding: "16px",
        borderTop: "1px solid #edf3f9",
        color: "#203242",
    },
    rowButton: {
        border: "none",
        background: "transparent",
        cursor: "pointer",
        padding: "10px 12px",
        borderRadius: "12px",
        fontWeight: 600,
        color: "#123c69",
    },
    detailGrid: {
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        gap: "20px",
    },
    detailCard: {
        background: "#ffffff",
        borderRadius: "24px",
        padding: "24px",
        boxShadow: "0 20px 50px rgba(12, 45, 72, 0.08)",
    },
    detailTitle: {
        margin: "0 0 16px",
        color: "#123c69",
        fontSize: "22px",
        fontWeight: 700,
    },
    detailRow: {
        display: "grid",
        gridTemplateColumns: "160px 1fr",
        gap: "12px",
        padding: "10px 0",
        borderBottom: "1px solid #eef3f7",
    },
    detailLabel: {
        color: "#6c8094",
        fontWeight: 600,
        textTransform: "capitalize",
    },
    detailValue: {
        color: "#203242",
    },
    sideInfo: {
        background: "linear-gradient(180deg, #eff7ff 0%, #ffffff 100%)",
        border: "1px solid #dceafb",
        borderRadius: "24px",
        padding: "24px",
    },
    modalOverlay: {
        position: "fixed",
        inset: 0,
        background: "rgba(7, 22, 39, 0.42)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        zIndex: 1000,
    },
    modal: {
        width: "100%",
        maxWidth: "720px",
        background: "#ffffff",
        borderRadius: "24px",
        padding: "24px",
        boxShadow: "0 28px 60px rgba(12, 45, 72, 0.22)",
    },
    formGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: "16px",
        marginTop: "20px",
    },
    field: {
        display: "grid",
        gap: "8px",
    },
    label: {
        color: "#44586c",
        fontWeight: 600,
        fontSize: "14px",
    },
    input: {
        width: "100%",
        boxSizing: "border-box",
        border: "1px solid #d9e5f2",
        borderRadius: "14px",
        padding: "12px 14px",
        fontSize: "15px",
        outline: "none",
    },
    modalActions: {
        display: "flex",
        justifyContent: "flex-end",
        gap: "12px",
        marginTop: "24px",
    },
    badge: {
        display: "inline-flex",
        padding: "8px 12px",
        borderRadius: "999px",
        fontWeight: 600,
        fontSize: "13px",
    },
    emptyState: {
        textAlign: "center",
        padding: "28px 16px",
        color: "#66788b",
    },
    successPopup: {
        position: "fixed",
        top: "24px",
        right: "24px",
        minWidth: "300px",
        background: "#ffffff",
        border: "1px solid #cfe9dd",
        borderRadius: "18px",
        padding: "16px 18px",
        boxShadow: "0 18px 40px rgba(15, 123, 108, 0.18)",
        zIndex: 1200,
    },
    successPopupTitle: {
        margin: 0,
        color: "#0f7b6c",
        fontSize: "16px",
        fontWeight: 700,
    },
    successPopupText: {
        margin: "6px 0 0",
        color: "#5b6b7a",
        lineHeight: 1.5,
        fontSize: "14px",
    },
};

const sidebarItems = [
    { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Quan ly nguoi dung", path: "/admin", icon: Users },
    { label: "Quan ly benh an", path: "/admin/patients", icon: FileText },
    { label: "Quan ly role", path: "/admin/roles", icon: ShieldCheck },
];

const statusColors = {
    Active: { color: "#067647", background: "#ecfdf3" },
    Inactive: { color: "#b42318", background: "#fff1f0" },
};

const initialUsers = [
    {
        id: "USR-001",
        fullName: "Nguyen Van An",
        email: "an.nguyen@hospital.vn",
        phone: "0901234567",
        role: "Admin",
        status: "Active",
    },
    {
        id: "USR-002",
        fullName: "Tran Thi Binh",
        email: "binh.tran@hospital.vn",
        phone: "0912345678",
        role: "Doctor",
        status: "Active",
    },
    {
        id: "USR-003",
        fullName: "Le Hoang Minh",
        email: "minh.le@hospital.vn",
        phone: "0987654321",
        role: "Receptionist",
        status: "Inactive",
    },
];

const emptyUserForm = {
    email: "",
    name: "",
    address: "",
    phone: "",
    roleName: "Doctor",
    age: "",
    sex: "",
    password: "",
};

const renderStatusBadge = (value) => {
    const color = statusColors[value] || { color: "#123c69", background: "#eef6ff" };
    return (
        <span style={{ ...adminShellStyles.badge, color: color.color, background: color.background }}>
            {value}
        </span>
    );
};

const AdminSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <aside style={adminShellStyles.sidebar}>
            <div style={adminShellStyles.brand}>
                <div style={adminShellStyles.brandTitle}>Admin Dashboard</div>
                <p style={adminShellStyles.brandText}>
                    Khu vuc quan tri nay gom dashboard tong quan, nguoi dung, benh an va role de quan ly tap trung.
                </p>
            </div>

            {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                    <button
                        key={item.path}
                        type="button"
                        onClick={() => navigate(item.path)}
                        style={{
                            ...adminShellStyles.menuButton,
                            background: isActive ? "#ffffff" : "transparent",
                            color: isActive ? "#123c69" : "#ffffff",
                            boxShadow: isActive ? "0 12px 30px rgba(7, 22, 39, 0.18)" : "none",
                        }}
                    >
                        <Icon size={20} />
                        <span>{item.label}</span>
                    </button>
                );
            })}

            <div
                style={{
                    marginTop: "28px",
                    borderRadius: "20px",
                    padding: "18px",
                    background: "rgba(255,255,255,0.08)",
                }}
            >
                <div style={{ fontWeight: 700, marginBottom: "8px" }}>Tong quan nhanh</div>
                <p style={{ margin: 0, color: "rgba(255,255,255,0.72)", lineHeight: 1.6, fontSize: "14px" }}>
                    Dashboard moi giup xem nhanh cac chi so truoc khi di vao tung man hinh quan ly.
                </p>
            </div>
        </aside>
    );
};

const ManageUser = () => {
    const [users, setUsers] = useState(initialUsers);
    const [selectedId, setSelectedId] = useState(initialUsers[0]?.id || null);
    const [modalMode, setModalMode] = useState("");
    const [formData, setFormData] = useState(emptyUserForm);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    const selectedItem = useMemo(
        () => users.find((item) => item.id === selectedId) || users[0] || null,
        [selectedId, users]
    );

    const summaryData = [
        { label: "Tong nguoi dung", value: users.length },
        { label: "Dang hoat dong", value: users.filter((item) => item.status === "Active").length },
        { label: "Tam khoa", value: users.filter((item) => item.status === "Inactive").length },
    ];

    const openModal = (mode) => {
        setModalMode(mode);
        setFormData(mode === "edit" && selectedItem ? { ...selectedItem } : { ...emptyUserForm });
    };

    const closeModal = () => {
        setModalMode("");
    };

    useEffect(() => {
        if (!showSuccessPopup) {
            return undefined;
        }

        const timer = window.setTimeout(() => {
            setShowSuccessPopup(false);
        }, 3000);

        return () => window.clearTimeout(timer);
    }, [showSuccessPopup]);

    const handleSubmit = async () => {
        // if (!formData.id.trim()) {
        //     return;
        // }

        // if (modalMode === "edit") {
        //     setUsers((prev) => prev.map((item) => (item.id === formData.id ? formData : item)));
        // } else {
        //     setUsers((prev) => [formData, ...prev]);
        // }

        // setSelectedId(formData.id);
        console.log("Saved data:", formData);

        try {
            await apiCreateUser(
                formData.age,
                formData.address,
                formData.email,
                formData.name,
                formData.password,
                formData.sex,
                formData.roleName,
                formData.phone
            );

            console.log("ok you");
            closeModal();
            setShowSuccessPopup(true);
        } catch (error) {
            console.error("Create user failed:", error);
        }
    };

    const handleDelete = () => {
        if (!selectedItem) {
            return;
        }

        const canDelete = window.confirm(`Ban co chac muon xoa ${selectedItem.fullName} khong?`);
        if (!canDelete) {
            return;
        }

        const nextUsers = users.filter((item) => item.id !== selectedItem.id);
        setUsers(nextUsers);
        setSelectedId(nextUsers[0]?.id || null);
    };


    const [usersDB, setUsersDB] = useState([])

    return (
        <div style={adminShellStyles.page}>
            {showSuccessPopup && (
                <div style={adminShellStyles.successPopup}>
                    <p style={adminShellStyles.successPopupTitle}>Đăng ký thành công</p>
                    <p style={adminShellStyles.successPopupText}>
                        Người dùng mới đã được đăng ký thành công.
                    </p>
                </div>
            )}

            <div
                style={{
                    ...adminShellStyles.shell,
                    gridTemplateColumns:
                        typeof window !== "undefined" && window.innerWidth < 992 ? "1fr" : adminShellStyles.shell.gridTemplateColumns,
                }}
            >
                <AdminSidebar />

                <main style={adminShellStyles.content}>
                    <section style={adminShellStyles.hero}>
                        <div>
                            <h1 style={adminShellStyles.heroTitle}>Quan ly nguoi dung</h1>
                            <p style={adminShellStyles.heroText}>
                                Theo doi danh sach tai khoan, phan role va cap nhat nhanh thong tin nguoi dung trong he thong.
                            </p>
                        </div>

                        <div style={adminShellStyles.summaryWrap}>
                            {summaryData.map((item) => (
                                <div key={item.label} style={adminShellStyles.summaryCard}>
                                    <span style={adminShellStyles.summaryLabel}>{item.label}</span>
                                    <div style={adminShellStyles.summaryValue}>{item.value}</div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section style={adminShellStyles.panel}>
                        <div style={adminShellStyles.panelHeader}>
                            <div>
                                <h2 style={adminShellStyles.panelTitle}>Danh sách người dùng</h2>
                                <div style={{ color: "#66788b" }}>Xem chi tiết & thao tác nhanh.</div>
                            </div>

                            <div style={adminShellStyles.actionGroup}>
                                <button
                                    type="button"
                                    onClick={() => openModal("add")}
                                    style={{ ...adminShellStyles.actionButton, ...adminShellStyles.primaryButton }}
                                >
                                    <Plus size={18} />
                                    Thêm mới
                                </button>
                                <button
                                    type="button"
                                    onClick={() => selectedItem && openModal("edit")}
                                    style={{ ...adminShellStyles.actionButton, ...adminShellStyles.secondaryButton }}
                                >
                                    <Pencil size={18} />
                                    Sửa
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    style={{ ...adminShellStyles.actionButton, ...adminShellStyles.dangerButton }}
                                >
                                    <Trash2 size={18} />
                                    Xóa
                                </button>
                            </div>
                        </div>

                        <TableUsers adminShellStyles={adminShellStyles}
                            setSelectedId={setSelectedId} usersDB={usersDB} selectedItem={selectedItem} setSelectedId={setSelectedId}

                        ></TableUsers>
                    </section>

                    <section
                        style={{
                            ...adminShellStyles.detailGrid,
                            gridTemplateColumns:
                                typeof window !== "undefined" && window.innerWidth < 1100 ? "1fr" : adminShellStyles.detailGrid.gridTemplateColumns,
                        }}
                    >
                        <div style={adminShellStyles.detailCard}>
                            <h3 style={adminShellStyles.detailTitle}>Thong tin chi tiet</h3>
                            {selectedItem ? (
                                Object.entries(selectedItem).map(([key, value]) => (
                                    <div key={key} style={adminShellStyles.detailRow}>
                                        <div style={adminShellStyles.detailLabel}>{key}</div>
                                        <div style={adminShellStyles.detailValue}>
                                            {key === "status" ? renderStatusBadge(value) : value}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={{ color: "#66788b" }}>Hay chon mot dong trong bang de xem chi tiet.</div>
                            )}
                        </div>

                        <div style={adminShellStyles.sideInfo}>
                            <div
                                style={{
                                    width: "56px",
                                    height: "56px",
                                    borderRadius: "18px",
                                    display: "grid",
                                    placeItems: "center",
                                    background: "#123c69",
                                    color: "#ffffff",
                                    marginBottom: "16px",
                                }}
                            >
                                <UserCog size={26} />
                            </div>
                            <h3 style={{ margin: "0 0 12px", color: "#123c69" }}>Khu thao tac</h3>
                            <p style={{ margin: 0, color: "#5f7285", lineHeight: 1.7 }}>
                                File nay chi xu ly module nguoi dung. Viec them, sua, xoa va xem chi tiet deu duoc dat rieng trong trang nay.
                            </p>
                        </div>
                    </section>
                </main>
            </div>

            <CreateUser
                modalMode={modalMode}
                adminShellStyles={adminShellStyles}
                formData={formData}
                setFormData={setFormData}
                closeModal={closeModal}
                handleSubmit={handleSubmit}
            />
        </div>
    );
};

export default ManageUser;
