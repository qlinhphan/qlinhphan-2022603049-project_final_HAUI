import {
    Activity,
    ArrowUpRight,
    FileText,
    LayoutDashboard,
    ShieldCheck,
    Stethoscope,
    TrendingUp,
    Users,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router";

const styles = {
    page: {
        minHeight: "100vh",
        background: "radial-gradient(circle at top left, #f6fbff 0%, #eef6ff 36%, #fdfefe 100%)",
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
        lineHeight: 1.6,
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
    sidebarCard: {
        marginTop: "28px",
        borderRadius: "22px",
        padding: "18px",
        background: "linear-gradient(180deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.06) 100%)",
        border: "1px solid rgba(255,255,255,0.14)",
    },
    sidebarCardTitle: {
        margin: 0,
        fontWeight: 700,
        fontSize: "15px",
    },
    sidebarCardText: {
        margin: "8px 0 0",
        color: "rgba(255,255,255,0.72)",
        lineHeight: 1.6,
        fontSize: "14px",
    },
    content: {
        display: "grid",
        gap: "22px",
    },
    hero: {
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(135deg, #123c69 0%, #0f7b6c 55%, #4ca6a8 100%)",
        color: "#ffffff",
        borderRadius: "30px",
        padding: "30px",
        boxShadow: "0 28px 70px rgba(16, 63, 99, 0.24)",
        display: "grid",
        gridTemplateColumns: "1.3fr 0.9fr",
        gap: "22px",
    },
    heroGlow: {
        position: "absolute",
        width: "280px",
        height: "280px",
        borderRadius: "999px",
        background: "rgba(255,255,255,0.10)",
        top: "-120px",
        right: "-40px",
        filter: "blur(8px)",
    },
    heroContent: {
        position: "relative",
        zIndex: 1,
    },
    heroEyebrow: {
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        background: "rgba(255,255,255,0.16)",
        borderRadius: "999px",
        padding: "8px 12px",
        fontSize: "13px",
        fontWeight: 600,
    },
    heroTitle: {
        margin: "18px 0 10px",
        fontSize: "36px",
        lineHeight: 1.15,
    },
    heroText: {
        margin: 0,
        maxWidth: "620px",
        color: "rgba(255,255,255,0.82)",
        lineHeight: 1.7,
    },
    heroMiniGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: "14px",
        alignSelf: "end",
        position: "relative",
        zIndex: 1,
    },
    heroMiniCard: {
        background: "rgba(255,255,255,0.12)",
        border: "1px solid rgba(255,255,255,0.14)",
        borderRadius: "22px",
        padding: "18px",
        backdropFilter: "blur(8px)",
    },
    heroMiniLabel: {
        display: "block",
        fontSize: "13px",
        color: "rgba(255,255,255,0.72)",
        marginBottom: "10px",
    },
    heroMiniValue: {
        fontSize: "28px",
        fontWeight: 700,
    },
    statGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        gap: "18px",
    },
    statCard: {
        background: "#ffffff",
        border: "1px solid #e3edf8",
        borderRadius: "26px",
        padding: "22px",
        boxShadow: "0 18px 45px rgba(12, 45, 72, 0.08)",
    },
    statTop: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "18px",
    },
    statIcon: {
        width: "52px",
        height: "52px",
        borderRadius: "18px",
        display: "grid",
        placeItems: "center",
    },
    statLabel: {
        margin: 0,
        color: "#5f7285",
        fontSize: "14px",
    },
    statValue: {
        margin: "6px 0 10px",
        color: "#123c69",
        fontSize: "36px",
        fontWeight: 700,
    },
    statFoot: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        color: "#0f7b6c",
        fontWeight: 600,
        fontSize: "14px",
    },
    lowerGrid: {
        display: "grid",
        gridTemplateColumns: "1.15fr 0.85fr",
        gap: "20px",
    },
    panel: {
        background: "#ffffff",
        borderRadius: "28px",
        padding: "24px",
        boxShadow: "0 20px 50px rgba(12, 45, 72, 0.08)",
        border: "1px solid #e8f0f7",
    },
    panelHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "16px",
        marginBottom: "18px",
        flexWrap: "wrap",
    },
    panelTitle: {
        margin: 0,
        color: "#123c69",
        fontSize: "24px",
        fontWeight: 700,
    },
    panelText: {
        margin: "8px 0 0",
        color: "#66788b",
        lineHeight: 1.6,
    },
    insightGrid: {
        display: "grid",
        gap: "14px",
    },
    insightCard: {
        borderRadius: "22px",
        padding: "18px",
        display: "grid",
        gridTemplateColumns: "56px 1fr auto",
        gap: "14px",
        alignItems: "center",
    },
    insightIcon: {
        width: "56px",
        height: "56px",
        borderRadius: "18px",
        display: "grid",
        placeItems: "center",
    },
    insightTitle: {
        margin: 0,
        color: "#16324f",
        fontSize: "17px",
        fontWeight: 700,
    },
    insightText: {
        margin: "6px 0 0",
        color: "#5f7285",
        lineHeight: 1.5,
        fontSize: "14px",
    },
    insightValue: {
        textAlign: "right",
        color: "#123c69",
        fontSize: "30px",
        fontWeight: 700,
    },
    ringPanel: {
        background: "linear-gradient(180deg, #f6fbff 0%, #ffffff 100%)",
        borderRadius: "24px",
        padding: "22px",
        border: "1px solid #dceafb",
        marginBottom: "16px",
    },
    ringWrap: {
        width: "180px",
        height: "180px",
        borderRadius: "999px",
        margin: "10px auto 18px",
        background: "conic-gradient(#0f7b6c 0deg 216deg, #123c69 216deg 300deg, #dceafb 300deg 360deg)",
        display: "grid",
        placeItems: "center",
    },
    ringInner: {
        width: "126px",
        height: "126px",
        borderRadius: "999px",
        background: "#ffffff",
        display: "grid",
        placeItems: "center",
        textAlign: "center",
    },
    ringValue: {
        color: "#123c69",
        fontSize: "32px",
        fontWeight: 700,
        lineHeight: 1,
    },
    ringLabel: {
        color: "#66788b",
        fontSize: "13px",
        marginTop: "6px",
    },
    progressList: {
        display: "grid",
        gap: "14px",
    },
    progressItem: {
        display: "grid",
        gap: "8px",
    },
    progressRow: {
        display: "flex",
        justifyContent: "space-between",
        gap: "12px",
        color: "#35506b",
        fontSize: "14px",
        fontWeight: 600,
    },
    progressTrack: {
        height: "10px",
        borderRadius: "999px",
        background: "#e8f0f7",
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
        borderRadius: "999px",
    },
};

const sidebarItems = [
    { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Quan ly nguoi dung", path: "/admin", icon: Users },
    { label: "Quan ly benh an", path: "/admin/patients", icon: FileText },
    { label: "Quan ly role", path: "/admin/roles", icon: ShieldCheck },
];

const roleData = [
    { id: "ROL-01", roleName: "Admin", members: 2 },
    { id: "ROL-02", roleName: "Doctor", members: 12 },
    { id: "ROL-03", roleName: "Receptionist", members: 5 },
];

const doctorData = [
    { id: "DOC-01", name: "Tran Thi Binh", specialty: "Noi tong quat" },
    { id: "DOC-02", name: "Nguyen Van An", specialty: "Tim mach" },
    { id: "DOC-03", name: "Pham Quoc Thai", specialty: "Tai mui hong" },
    { id: "DOC-04", name: "Le Minh Chau", specialty: "Noi tiet" },
];

const patientData = [
    { id: "PT-01", status: "Stable" },
    { id: "PT-02", status: "Monitoring" },
    { id: "PT-03", status: "Stable" },
    { id: "PT-04", status: "Follow-up" },
    { id: "PT-05", status: "Monitoring" },
    { id: "PT-06", status: "Stable" },
    { id: "PT-07", status: "Follow-up" },
    { id: "PT-08", status: "Stable" },
    { id: "PT-09", status: "Monitoring" },
];

const AdminSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <aside style={styles.sidebar}>
            <div style={styles.brand}>
                <div style={styles.brandTitle}>Admin Dashboard</div>
                <p style={styles.brandText}>
                    Theo doi nhanh toan bo he thong tu mot man hinh tong quan truoc khi di vao tung module.
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

            <div style={styles.sidebarCard}>
                <p style={styles.sidebarCardTitle}>Tong quan hom nay</p>
                <p style={styles.sidebarCardText}>
                    He thong dang co {roleData.length} role, {doctorData.length} bac si va {patientData.length} ho so benh nhan mau.
                </p>
            </div>
        </aside>
    );
};

const ManageDashboard = () => {
    const stableCount = patientData.filter((item) => item.status === "Stable").length;
    const monitoringCount = patientData.filter((item) => item.status === "Monitoring").length;
    const followUpCount = patientData.filter((item) => item.status === "Follow-up").length;

    const statCards = [
        {
            label: "Tong so role",
            value: roleData.length,
            note: "He thong quyen dang hoat dong on dinh",
            icon: ShieldCheck,
            iconStyle: { background: "#eef4ff", color: "#123c69" },
        },
        {
            label: "So luong bac si",
            value: doctorData.length,
            note: "Tang 2 nguoi so voi thang truoc",
            icon: Stethoscope,
            iconStyle: { background: "#ecfdf3", color: "#0f7b6c" },
        },
        {
            label: "So luong benh nhan",
            value: patientData.length,
            note: "Co 3 ho so can theo doi sat",
            icon: Users,
            iconStyle: { background: "#fff4eb", color: "#c15c12" },
        },
    ];

    const insightCards = [
        {
            title: "Role va quyen truy cap",
            text: "Cau truc role hien gon va de mo rong khi can them nhom quyen moi.",
            value: roleData.length,
            icon: ShieldCheck,
            colors: {
                background: "linear-gradient(135deg, #eef4ff 0%, #f8fbff 100%)",
                border: "1px solid #dbe7ff",
                iconBg: "#dfe9ff",
                iconColor: "#123c69",
            },
        },
        {
            title: "Nhan su bac si",
            text: "Doi ngu bac si dang phu trach da chuyen khoa va kham tong quat.",
            value: doctorData.length,
            icon: Stethoscope,
            colors: {
                background: "linear-gradient(135deg, #ecfdf3 0%, #f8fffb 100%)",
                border: "1px solid #d8f3e5",
                iconBg: "#d9f6e7",
                iconColor: "#0f7b6c",
            },
        },
        {
            title: "Ho so benh nhan",
            text: "Theo doi nhanh tinh trang benh nhan de uu tien truong hop can can thiep.",
            value: patientData.length,
            icon: FileText,
            colors: {
                background: "linear-gradient(135deg, #fff6ec 0%, #fffdfa 100%)",
                border: "1px solid #ffe7ca",
                iconBg: "#ffe8cd",
                iconColor: "#c15c12",
            },
        },
    ];

    const patientStatus = [
        {
            label: "Stable",
            value: stableCount,
            percent: Math.round((stableCount / patientData.length) * 100),
            color: "#0f7b6c",
        },
        {
            label: "Monitoring",
            value: monitoringCount,
            percent: Math.round((monitoringCount / patientData.length) * 100),
            color: "#123c69",
        },
        {
            label: "Follow-up",
            value: followUpCount,
            percent: Math.round((followUpCount / patientData.length) * 100),
            color: "#c15c12",
        },
    ];

    return (
        <div style={styles.page}>
            <div
                style={{
                    ...styles.shell,
                    gridTemplateColumns:
                        typeof window !== "undefined" && window.innerWidth < 992 ? "1fr" : styles.shell.gridTemplateColumns,
                }}
            >
                <AdminSidebar />

                <main style={styles.content}>
                    <section
                        style={{
                            ...styles.hero,
                            gridTemplateColumns:
                                typeof window !== "undefined" && window.innerWidth < 1180 ? "1fr" : styles.hero.gridTemplateColumns,
                        }}
                    >
                        <div style={styles.heroGlow} />

                        <div style={styles.heroContent}>
                            <div style={styles.heroEyebrow}>
                                <Activity size={16} />
                                Admin overview
                            </div>
                            <h1 style={styles.heroTitle}>Dashboard tong quan cho he thong quan ly phong kham</h1>
                            <p style={styles.heroText}>
                                Theo doi nhanh so luong role, bac si va benh nhan trong mot giao dien ro rang, sang trong va de doc
                                tren ca desktop lan mobile.
                            </p>
                        </div>

                        <div
                            style={{
                                ...styles.heroMiniGrid,
                                gridTemplateColumns:
                                    typeof window !== "undefined" && window.innerWidth < 640 ? "1fr" : styles.heroMiniGrid.gridTemplateColumns,
                            }}
                        >
                            <div style={styles.heroMiniCard}>
                                <span style={styles.heroMiniLabel}>Tong thanh vien he thong</span>
                                <div style={styles.heroMiniValue}>{roleData.reduce((sum, item) => sum + item.members, 0)}</div>
                            </div>
                            <div style={styles.heroMiniCard}>
                                <span style={styles.heroMiniLabel}>Ho so dang theo doi</span>
                                <div style={styles.heroMiniValue}>{monitoringCount + followUpCount}</div>
                            </div>
                        </div>
                    </section>

                    <section
                        style={{
                            ...styles.statGrid,
                            gridTemplateColumns:
                                typeof window !== "undefined" && window.innerWidth < 1100 ? "1fr" : styles.statGrid.gridTemplateColumns,
                        }}
                    >
                        {statCards.map((item) => {
                            const Icon = item.icon;

                            return (
                                <article key={item.label} style={styles.statCard}>
                                    <div style={styles.statTop}>
                                        <div>
                                            <p style={styles.statLabel}>{item.label}</p>
                                            <div style={styles.statValue}>{item.value}</div>
                                        </div>
                                        <div style={{ ...styles.statIcon, ...item.iconStyle }}>
                                            <Icon size={24} />
                                        </div>
                                    </div>
                                    <div style={styles.statFoot}>
                                        <TrendingUp size={16} />
                                        <span>{item.note}</span>
                                    </div>
                                </article>
                            );
                        })}
                    </section>

                    <section
                        style={{
                            ...styles.lowerGrid,
                            gridTemplateColumns:
                                typeof window !== "undefined" && window.innerWidth < 1100 ? "1fr" : styles.lowerGrid.gridTemplateColumns,
                        }}
                    >
                        <div style={styles.panel}>
                            <div style={styles.panelHeader}>
                                <div>
                                    <h2 style={styles.panelTitle}>Diem nhan quan tri</h2>
                                    <p style={styles.panelText}>
                                        Cac module quan trong duoc tom gon thanh nhung card de xem nhanh va dieu huong tiep.
                                    </p>
                                </div>
                            </div>

                            <div style={styles.insightGrid}>
                                {insightCards.map((item) => {
                                    const Icon = item.icon;

                                    return (
                                        <div
                                            key={item.title}
                                            style={{
                                                ...styles.insightCard,
                                                background: item.colors.background,
                                                border: item.colors.border,
                                            }}
                                        >
                                            <div
                                                style={{
                                                    ...styles.insightIcon,
                                                    background: item.colors.iconBg,
                                                    color: item.colors.iconColor,
                                                }}
                                            >
                                                <Icon size={24} />
                                            </div>

                                            <div>
                                                <h3 style={styles.insightTitle}>{item.title}</h3>
                                                <p style={styles.insightText}>{item.text}</p>
                                            </div>

                                            <div style={styles.insightValue}>
                                                {item.value}
                                                <div style={{ color: "#0f7b6c", marginTop: "8px" }}>
                                                    <ArrowUpRight size={18} />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div style={styles.panel}>
                            <div style={styles.panelHeader}>
                                <div>
                                    <h2 style={styles.panelTitle}>Tinh trang benh nhan</h2>
                                    <p style={styles.panelText}>Ty le benh nhan duoc nhom theo muc do theo doi hien tai.</p>
                                </div>
                            </div>

                            <div style={styles.ringPanel}>
                                <div style={styles.ringWrap}>
                                    <div style={styles.ringInner}>
                                        <div>
                                            <div style={styles.ringValue}>{patientData.length}</div>
                                            <div style={styles.ringLabel}>Benh nhan</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={styles.progressList}>
                                {patientStatus.map((item) => (
                                    <div key={item.label} style={styles.progressItem}>
                                        <div style={styles.progressRow}>
                                            <span>
                                                {item.label} ({item.value})
                                            </span>
                                            <span>{item.percent}%</span>
                                        </div>
                                        <div style={styles.progressTrack}>
                                            <div
                                                style={{
                                                    ...styles.progressFill,
                                                    width: `${item.percent}%`,
                                                    background: item.color,
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default ManageDashboard;
