import { FileText, LayoutDashboard, ShieldCheck, Stethoscope, Users } from "lucide-react";
import { useLocation, useNavigate } from "react-router";

const sidebarItems = [
    { label: "Thong ke", path: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Quan ly nguoi dung", path: "/admin", icon: Users },
    { label: "Quan ly benh an", path: "/admin/patients", icon: FileText },
    { label: "Quan ly role", path: "/admin/roles", icon: ShieldCheck },
];

const styles = {
    sidebar: {
        position: "sticky",
        top: "24px",
        overflow: "hidden",
        borderRadius: "28px",
        padding: "24px 18px",
        background:
            "linear-gradient(180deg, rgba(255, 255, 255, 0.1), transparent 36%), linear-gradient(160deg, #123c69 0%, #0f2742 100%)",
        boxShadow: "0 28px 60px rgba(18, 60, 105, 0.22)",
        color: "#ffffff",
    },
    brand: {
        marginBottom: "24px",
        padding: "8px 8px 22px",
        borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
    },
    badge: {
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 12px",
        borderRadius: "999px",
        background: "rgba(255, 255, 255, 0.12)",
        fontSize: "12px",
        fontWeight: 700,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
    },
    title: {
        margin: "16px 0 8px",
        fontSize: "28px",
        lineHeight: 1.1,
    },
    text: {
        margin: 0,
        color: "rgba(255, 255, 255, 0.78)",
        lineHeight: 1.6,
        fontSize: "14px",
    },
    navButton: {
        width: "100%",
        marginBottom: "12px",
        border: 0,
        borderRadius: "18px",
        padding: "14px 16px",
        background: "transparent",
        color: "inherit",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        textAlign: "left",
        cursor: "pointer",
        transition: "transform 0.18s ease, background 0.18s ease, box-shadow 0.18s ease",
    },
    footer: {
        marginTop: "28px",
        borderRadius: "22px",
        padding: "18px",
        background: "linear-gradient(180deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.06) 100%)",
        border: "1px solid rgba(255,255,255,0.14)",
    },
    footerTitle: {
        margin: 0,
        fontWeight: 700,
        fontSize: "15px",
    },
    footerText: {
        margin: "8px 0 0",
        color: "rgba(255,255,255,0.72)",
        lineHeight: 1.6,
        fontSize: "14px",
    },
};

export default function AdminSidebar({
    title = "Admin Dashboard",
    description = "Khu vuc quan tri nay gom dashboard tong quan, nguoi dung, benh an va role de quan ly tap trung.",
    footerTitle,
    footerText,
}) {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <aside style={styles.sidebar}>
            <div style={styles.brand}>
                <div style={styles.badge}>
                    <Stethoscope size={14} />
                    Admin panel
                </div>
                <h2 style={styles.title}>{title}</h2>
                <p style={styles.text}>{description}</p>
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
                            ...styles.navButton,
                            background: isActive ? "#ffffff" : "transparent",
                            color: isActive ? "#123c69" : "#ffffff",
                            boxShadow: isActive ? "0 14px 28px rgba(7, 22, 39, 0.18)" : "none",
                        }}
                    >
                        <Icon size={19} />
                        <span>{item.label}</span>
                    </button>
                );
            })}

            {footerTitle || footerText ? (
                <div style={styles.footer}>
                    {footerTitle ? <p style={styles.footerTitle}>{footerTitle}</p> : null}
                    {footerText ? <p style={styles.footerText}>{footerText}</p> : null}
                </div>
            ) : null}
        </aside>
    );
}
