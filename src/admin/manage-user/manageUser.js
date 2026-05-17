import { useEffect, useMemo, useState } from "react";
import { FileText, LayoutDashboard, Pencil, Plus, ShieldCheck, UserCog, Users } from "lucide-react";
import TableUsers from "./tableUser";
import CreateUser from "./createUser";
import { apiCreateUser, getAllUserAndPage } from "../../axios/user";
import DeleteUser from "./deleteUser";
import { useSelector } from "react-redux";
import SharedAdminSidebar from "../components/AdminSidebar";
import Header from "../header";

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
    { label: "Thống kê", path: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Quản lý người dùng", path: "/admin", icon: Users },
    { label: "Quản lý bệnh án", path: "/admin/patients", icon: FileText },
    { label: "Quản lý role", path: "/admin/roles", icon: ShieldCheck },
];

const statusColors = {
    Active: { color: "#067647", background: "#ecfdf3" },
    Inactive: { color: "#b42318", background: "#fff1f0" },
};

const emptyUserForm = {
    email: "",
    name: "",
    address: "",
    phone: "",
    roleName: "doctor",
    age: "",
    gender: "male",
    password: "",
};

const normalizeUserForm = (data = {}) => ({
    ...emptyUserForm,
    ...data,
    roleName: String(data?.roleName ?? emptyUserForm.roleName).toLowerCase(),
    gender: String(data?.gender ?? emptyUserForm.gender).toLowerCase(),
});

const renderStatusBadge = (value) => {
    const color = statusColors[value] || { color: "#123c69", background: "#eef6ff" };
    return (
        <span style={{ ...adminShellStyles.badge, color: color.color, background: color.background }}>
            {value}
        </span>
    );
};

const AdminSidebar = () => {
    return (
        <SharedAdminSidebar
            title="Admin Dashboard"
            description="Khu vuc quan tri nay gom dashboard tong quan, nguoi dung, benh an va role de quan ly tap trung."
            footerTitle="Tong quan nhanh"
            footerText="Dashboard moi giup xem nhanh cac chi so truoc khi di vao tung man hinh quan ly."
        />
    );
};

const ManageUser = () => {
    const [selectedId, setSelectedId] = useState(null);
    const [modalMode, setModalMode] = useState("");
    const [formData, setFormData] = useState(emptyUserForm);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [successPopupContent, setSuccessPopupContent] = useState({
        title: "Đăng ký thành công",
        text: "Người dùng mới đã được đăng ký thành công.",
    });
    const [usersDB, setUsersDB] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalObj, setTotalObj] = useState(0);
    const pageLimit = 5;

    const selectedItem = useMemo(
        () => usersDB.find((item) => (item.id || item.idUser) === selectedId) || usersDB[0] || null,
        [selectedId, usersDB]
    );

    const summaryData = [
        { label: "Tổng người dùng", value: totalObj },
        { label: "Số bản ghi của trang", value: usersDB.length },
        { label: "Tổng số trang", value: totalPages },
    ];

    const openModal = (mode) => {
        setModalMode(mode);
        setFormData(mode === "edit" && selectedItem ? normalizeUserForm(selectedItem) : { ...emptyUserForm });
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
        if (modalMode === "edit") {
            console.warn("Edit user API is not implemented yet.");
            setSuccessPopupContent({
                title: "Cập nhật chưa sẵn sàng",
                text: "Chức năng cập nhật người dùng hiện chưa được cài đặt.",
            });
            setShowSuccessPopup(true);
            return;
        }

        const normalizedFormData = normalizeUserForm(formData);

        if (!normalizedFormData.email.trim() || !normalizedFormData.password.trim() || !String(normalizedFormData.age).trim()) {
            console.warn("Create user blocked: missing required fields", normalizedFormData);
            setSuccessPopupContent({
                title: "Thiếu thông tin bắt buộc",
                text: "Vui lòng nhập đầy đủ email, mật khẩu và tuổi.",
            });
            setShowSuccessPopup(true);
            return;
        }

        console.log("handleSubmit called", { modalMode, formData });
        console.log("Create user payload:", normalizedFormData);

        try {
            console.log("Calling apiCreateUser...");
            await apiCreateUser(
                accessToken,
                normalizedFormData.age,
                normalizedFormData.address,
                normalizedFormData.email,
                normalizedFormData.name,
                normalizedFormData.password,
                normalizedFormData.gender,
                normalizedFormData.roleName,
                normalizedFormData.phone
            );

            console.log("apiCreateUser succeeded");
            await allUserAndPage(1);
            closeModal();
            setFormData({ ...emptyUserForm });
            setSuccessPopupContent({
                title: "Tạo mới thành công",
                text: "Người dùng mới đã được đăng ký thành công.",
            });
            setShowSuccessPopup(true);
        } catch (error) {
            console.error("Create user failed:", error);
            const errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                "Thêm mới người dùng thất bại.";
            setSuccessPopupContent({
                title: "Tạo mới thất bại",
                text: errorMessage,
            });
            setSuccessPopupContent({
                title: "Tạo mới thất bại",
                text: "Thêm mới người dùng thất bại.",
            });
            setShowSuccessPopup(true);
            setSuccessPopupContent({
                title: "Tạo mới thất bại",
                text: errorMessage,
            });
        }
    };

    const accessToken = useSelector((state) => state.user.user.accessToken);
    const allUserAndPage = async (page = 1) => {
        try {
            const rs = await getAllUserAndPage(accessToken, page, pageLimit);
            const payload = rs?.data?.message ?? rs?.data ?? {};
            const userList = payload?.allUser ?? [];
            const nextTotalPages = Number(payload?.totalPages ?? 1);
            const nextTotalObj = Number(payload?.totalObj ?? 0);

            console.log("CHECK::", payload);
            setUsersDB(Array.isArray(userList) ? userList : []);
            setCurrentPage(page);
            setTotalPages(Number(nextTotalPages) > 0 ? Number(nextTotalPages) : 1);
            setTotalObj(Number(nextTotalObj) >= 0 ? Number(nextTotalObj) : 0);
            setSelectedId((Array.isArray(userList) && userList[0] && (userList[0].id || userList[0].idUser)) || null);
        } catch (error) {
            console.error("Get users failed:", error);
            setUsersDB([]);
            setTotalPages(1);
            setTotalObj(0);
            setSelectedId(null);
        }
    };

    useEffect(() => {
        allUserAndPage(1)
        // console.log("CHECK USER: GET ALL USERS")
    }, [])

    return (
        <div style={adminShellStyles.page}>
            {showSuccessPopup && (
                <div style={adminShellStyles.successPopup}>
                    <p style={adminShellStyles.successPopupTitle}>{successPopupContent.title}</p>
                    <p style={adminShellStyles.successPopupText}>{successPopupContent.text}</p>
                </div>
            )}

            <div style={adminShellStyles.shell}>
                <AdminSidebar />

                <main style={adminShellStyles.content}>
                    <Header />

                    <section style={adminShellStyles.hero}>
                        <div>
                            <h1 style={adminShellStyles.heroTitle}>Quản lý người dùng</h1>
                            <p style={adminShellStyles.heroText}>
                                Theo dõi danh sách tài khoản, phân role và cập nhật nhanh thông tin người dùng trong hệ thống.
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
                                <DeleteUser
                                    adminShellStyles={adminShellStyles}
                                    usersDB={usersDB}
                                    selectedItem={selectedItem}
                                    setUsersDB={setUsersDB}
                                    setSelectedId={setSelectedId}
                                    setTotalObj={setTotalObj}
                                    setSuccessPopupContent={setSuccessPopupContent}
                                    setShowSuccessPopup={setShowSuccessPopup}
                                    allUserAndPage={allUserAndPage}
                                    pageLimit={pageLimit}
                                    setCurrentPage={setCurrentPage}
                                    setTotalPages={setTotalPages}
                                />
                            </div>
                        </div>

                        <TableUsers
                            adminShellStyles={adminShellStyles}
                            setSelectedId={setSelectedId}
                            usersDB={usersDB}
                            selectedItem={selectedItem}
                            setUsersDB={setUsersDB}
                            setTotalObj={setTotalObj}
                            setSuccessPopupContent={setSuccessPopupContent}
                            setShowSuccessPopup={setShowSuccessPopup}
                            allUserAndPage={allUserAndPage}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalObj={totalObj}
                            onPageChange={allUserAndPage}
                        />
                    </section>

                    <section style={adminShellStyles.detailGrid}>
                        <div style={adminShellStyles.detailCard}>
                            <h3 style={adminShellStyles.detailTitle}>Thông tin chi tiết</h3>
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

                        {/* <div style={adminShellStyles.sideInfo}>
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
                        </div> */}
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
