import { FileText, LayoutDashboard, ShieldCheck, Users } from "lucide-react";
import { useLocation, useNavigate } from "react-router";

const styles = {
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
    brandTitle: { fontSize: "24px", fontWeight: 700, marginBottom: "8px" },
    brandText: { margin: 0, color: "rgba(255,255,255,0.72)", lineHeight: 1.5, fontSize: "14px" },
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
    content: { display: "grid", gap: "20px" },
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
    heroTitle: { margin: 0, color: "#123c69", fontSize: "30px", fontWeight: 700 },
    heroText: { margin: "8px 0 0", color: "#5b6b7a", lineHeight: 1.6, maxWidth: "720px" },
    summaryWrap: { display: "grid", gridTemplateColumns: "repeat(3, minmax(150px, 1fr))", gap: "12px", width: "100%" },
    summaryCard: { background: "#f3f8ff", border: "1px solid #dceafb", borderRadius: "18px", padding: "16px" },
    summaryLabel: { display: "block", fontSize: "13px", color: "#5f7285", marginBottom: "8px" },
    summaryValue: { fontSize: "28px", fontWeight: 700, color: "#123c69" },
    panel: { background: "#ffffff", borderRadius: "24px", padding: "24px", boxShadow: "0 20px 50px rgba(12, 45, 72, 0.08)" },
    panelHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap", marginBottom: "20px" },
    panelTitle: { margin: 0, color: "#123c69", fontSize: "24px", fontWeight: 700 },
    tableWrap: { overflowX: "auto", border: "1px solid #e4edf7", borderRadius: "20px" },
    table: { width: "100%", borderCollapse: "collapse", minWidth: "760px" },
    th: { textAlign: "left", padding: "16px", background: "#f5f9ff", color: "#5f7285", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.04em" },
    td: { padding: "16px", borderTop: "1px solid #edf3f9", color: "#203242" },
    detailGrid: { display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" },
    detailCard: { background: "#ffffff", borderRadius: "24px", padding: "24px", boxShadow: "0 20px 50px rgba(12, 45, 72, 0.08)" },
    detailTitle: { margin: "0 0 16px", color: "#123c69", fontSize: "22px", fontWeight: 700 },
    detailRow: { display: "grid", gridTemplateColumns: "160px 1fr", gap: "12px", padding: "10px 0", borderBottom: "1px solid #eef3f7" },
    detailLabel: { color: "#6c8094", fontWeight: 600, textTransform: "capitalize" },
    detailValue: { color: "#203242" },
    sideInfo: { background: "linear-gradient(180deg, #eff7ff 0%, #ffffff 100%)", border: "1px solid #dceafb", borderRadius: "24px", padding: "24px" },
};

const sidebarItems = [
    { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Quan ly nguoi dung", path: "/admin", icon: Users },
    { label: "Quan ly benh an", path: "/admin/patients", icon: FileText },
    { label: "Quan ly role", path: "/admin/roles", icon: ShieldCheck },
];

const roleData = [
    { id: "ROL-01", roleName: "Admin", description: "Toan quyen quan tri he thong va nguoi dung", members: 2 },
    { id: "ROL-02", roleName: "Doctor", description: "Quan ly benh an va cap nhat thong tin dieu tri", members: 12 },
    { id: "ROL-03", roleName: "Receptionist", description: "Ho tro tiep nhan, dat lich va cap nhat thong tin co ban", members: 5 },
];

const AdminSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <aside style={styles.sidebar}>
            <div style={styles.brand}>
                <div style={styles.brandTitle}>Admin Dashboard</div>
                <p style={styles.brandText}>Sidebar da bo sung dashboard tong quan de xem nhanh role, bac si va benh nhan.</p>
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
                            ...styles.menuButton,
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
        </aside>
    );
};

const ManageRole = () => {
    const summaryData = [
        { label: "Tong role", value: roleData.length },
        { label: "Role quan tri", value: 1 },
        { label: "Tong thanh vien", value: roleData.reduce((sum, item) => sum + item.members, 0) },
    ];

    const selectedRole = roleData[0];

    return (
        <div style={styles.page}>
            <div
                style={{
                    ...styles.shell,
                    gridTemplateColumns: typeof window !== "undefined" && window.innerWidth < 992 ? "1fr" : styles.shell.gridTemplateColumns,
                }}
            >
                <AdminSidebar />

                <main style={styles.content}>
                    <section style={styles.hero}>
                        <div>
                            <h1 style={styles.heroTitle}>Quan ly role</h1>
                            <p style={styles.heroText}>Danh sach role duoc tach sang file rieng. Phan nay hien tai chi hien thi thong tin va chua can them thao tac CRUD.</p>
                        </div>

                        <div style={styles.summaryWrap}>
                            {summaryData.map((item) => (
                                <div key={item.label} style={styles.summaryCard}>
                                    <span style={styles.summaryLabel}>{item.label}</span>
                                    <div style={styles.summaryValue}>{item.value}</div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section style={styles.panel}>
                        <div style={styles.panelHeader}>
                            <div>
                                <h2 style={styles.panelTitle}>Danh sach role</h2>
                                <div style={{ color: "#66788b" }}>Bang nay chi hien thi danh sach role trong he thong.</div>
                            </div>
                        </div>

                        <div style={styles.tableWrap}>
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={styles.th}>Ma role</th>
                                        <th style={styles.th}>Ten role</th>
                                        <th style={styles.th}>Mo ta</th>
                                        <th style={styles.th}>So thanh vien</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {roleData.map((item) => (
                                        <tr key={item.id}>
                                            <td style={styles.td}>{item.id}</td>
                                            <td style={styles.td}>{item.roleName}</td>
                                            <td style={styles.td}>{item.description}</td>
                                            <td style={styles.td}>{item.members}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section
                        style={{
                            ...styles.detailGrid,
                            gridTemplateColumns: typeof window !== "undefined" && window.innerWidth < 1100 ? "1fr" : styles.detailGrid.gridTemplateColumns,
                        }}
                    >
                        <div style={styles.detailCard}>
                            <h3 style={styles.detailTitle}>Chi tiet role mau</h3>
                            {Object.entries(selectedRole).map(([key, value]) => (
                                <div key={key} style={styles.detailRow}>
                                    <div style={styles.detailLabel}>{key}</div>
                                    <div style={styles.detailValue}>{value}</div>
                                </div>
                            ))}
                        </div>

                        <div style={styles.sideInfo}>
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
                                <ShieldCheck size={26} />
                            </div>
                            <h3 style={{ margin: "0 0 12px", color: "#123c69" }}>Ghi chu module</h3>
                            <p style={{ margin: 0, color: "#5f7285", lineHeight: 1.7 }}>
                                Khi ban can mo rong sau nay, co the them popup phan quyen ngay trong file nay ma khong can dong vao hai module con lai.
                            </p>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default ManageRole;
