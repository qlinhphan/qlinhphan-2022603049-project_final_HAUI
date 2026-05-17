import { useState } from "react";
import { LogOut } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { apiLogout } from "../axios/loginAPI";

const styles = {
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "16px",
        flexWrap: "wrap",
        padding: "18px 22px",
        borderRadius: "22px",
        background: "rgba(255, 255, 255, 0.92)",
        border: "1px solid #e3edf8",
        boxShadow: "0 18px 45px rgba(12, 45, 72, 0.08)",
    },
    helloWrap: {
        display: "grid",
        gap: "6px",
    },
    helloLabel: {
        color: "#6a7d90",
        fontSize: "13px",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        fontWeight: 700,
    },
    helloName: {
        color: "#123c69",
        fontSize: "26px",
        fontWeight: 700,
        lineHeight: 1.2,
    },
    logoutButton: {
        border: "none",
        borderRadius: "16px",
        padding: "12px 18px",
        background: "#123c69",
        color: "#ffffff",
        fontWeight: 600,
        fontSize: "14px",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
    },
};

export default function Header() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const userName = useSelector((state) => state.user.user.name);
    const accessToken = useSelector((state) => state.user.user.accessToken);

    const handleLogout = async () => {
        if (isLoggingOut) {
            return;
        }

        try {
            setIsLoggingOut(true);

            if (accessToken) {
                await apiLogout(accessToken);
            }
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            dispatch({ type: "logout" });
            navigate("/login");
            setIsLoggingOut(false);
        }
    };

    return (
        <header style={styles.header}>
            <div style={styles.helloWrap}>
                <span style={styles.helloLabel}>Xin chào</span>
                <div style={styles.helloName}>{userName || "Nguoi dung"}</div>
            </div>

            <button
                type="button"
                onClick={handleLogout}
                style={styles.logoutButton}
                disabled={isLoggingOut}
            >
                <LogOut size={18} />
                {isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất"}
            </button>
        </header>
    );
}
