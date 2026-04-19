import { useMemo, useState } from "react";
import { ClipboardPlus, Eye, FileText, LayoutDashboard, Pencil, Plus, ShieldCheck, Trash2, Users } from "lucide-react";
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
    actionGroup: { display: "flex", gap: "12px", flexWrap: "wrap" },
    actionButton: { border: "none", borderRadius: "14px", padding: "12px 16px", fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px" },
    primaryButton: { background: "#0f7b6c", color: "#ffffff" },
    secondaryButton: { background: "#f2f7fb", color: "#123c69" },
    dangerButton: { background: "#fff1f0", color: "#b42318" },
    tableWrap: { overflowX: "auto", border: "1px solid #e4edf7", borderRadius: "20px" },
    table: { width: "100%", borderCollapse: "collapse", minWidth: "760px" },
    th: { textAlign: "left", padding: "16px", background: "#f5f9ff", color: "#5f7285", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.04em" },
    td: { padding: "16px", borderTop: "1px solid #edf3f9", color: "#203242" },
    rowButton: { border: "none", background: "transparent", cursor: "pointer", padding: "10px 12px", borderRadius: "12px", fontWeight: 600, color: "#123c69" },
    detailGrid: { display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" },
    detailCard: { background: "#ffffff", borderRadius: "24px", padding: "24px", boxShadow: "0 20px 50px rgba(12, 45, 72, 0.08)" },
    detailTitle: { margin: "0 0 16px", color: "#123c69", fontSize: "22px", fontWeight: 700 },
    detailRow: { display: "grid", gridTemplateColumns: "160px 1fr", gap: "12px", padding: "10px 0", borderBottom: "1px solid #eef3f7" },
    detailLabel: { color: "#6c8094", fontWeight: 600, textTransform: "capitalize" },
    detailValue: { color: "#203242" },
    sideInfo: { background: "linear-gradient(180deg, #eff7ff 0%, #ffffff 100%)", border: "1px solid #dceafb", borderRadius: "24px", padding: "24px" },
    modalOverlay: { position: "fixed", inset: 0, background: "rgba(7, 22, 39, 0.42)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", zIndex: 1000 },
    modal: { width: "100%", maxWidth: "720px", background: "#ffffff", borderRadius: "24px", padding: "24px", boxShadow: "0 28px 60px rgba(12, 45, 72, 0.22)" },
    formGrid: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "16px", marginTop: "20px" },
    field: { display: "grid", gap: "8px" },
    fieldWide: { gridColumn: "1 / -1" },
    label: { color: "#44586c", fontWeight: 600, fontSize: "14px" },
    input: { width: "100%", boxSizing: "border-box", border: "1px solid #d9e5f2", borderRadius: "14px", padding: "12px 14px", fontSize: "15px", outline: "none" },
    modalActions: { display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" },
    badge: { display: "inline-flex", padding: "8px 12px", borderRadius: "999px", fontWeight: 600, fontSize: "13px" },
};

const sidebarItems = [
    { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Quan ly nguoi dung", path: "/admin", icon: Users },
    { label: "Quan ly benh an", path: "/admin/patients", icon: FileText },
    { label: "Quan ly role", path: "/admin/roles", icon: ShieldCheck },
];

const statusColors = {
    Stable: { color: "#175cd3", background: "#eff8ff" },
    "Follow-up": { color: "#7a5af8", background: "#f4f3ff" },
    Monitoring: { color: "#b54708", background: "#fff7ed" },
};

const initialPatients = [
    { id: "MR-101", patientName: "Pham Gia Han", diagnosis: "Viem hong cap", doctor: "Tran Thi Binh", updatedAt: "2026-04-18", status: "Follow-up" },
    { id: "MR-102", patientName: "Do Quoc Bao", diagnosis: "Cao huyet ap", doctor: "Nguyen Van An", updatedAt: "2026-04-17", status: "Stable" },
    { id: "MR-103", patientName: "Vo Minh Chau", diagnosis: "Dai thao duong type 2", doctor: "Tran Thi Binh", updatedAt: "2026-04-16", status: "Monitoring" },
];

const emptyPatientForm = {
    id: "",
    patientName: "",
    diagnosis: "",
    doctor: "",
    updatedAt: "",
    status: "Stable",
};

const renderStatusBadge = (value) => {
    const color = statusColors[value] || { color: "#123c69", background: "#eef6ff" };
    return <span style={{ ...styles.badge, color: color.color, background: color.background }}>{value}</span>;
};

const AdminSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <aside style={styles.sidebar}>
            <div style={styles.brand}>
                <div style={styles.brandTitle}>Admin Dashboard</div>
                <p style={styles.brandText}>Tu dashboard tong quan, ban co the di nhanh sang benh an de theo doi du lieu dieu tri.</p>
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

const ManagePatient = () => {
    const [patients, setPatients] = useState(initialPatients);
    const [selectedId, setSelectedId] = useState(initialPatients[0]?.id || null);
    const [modalMode, setModalMode] = useState("");
    const [formData, setFormData] = useState(emptyPatientForm);

    const selectedItem = useMemo(
        () => patients.find((item) => item.id === selectedId) || patients[0] || null,
        [patients, selectedId]
    );

    const summaryData = [
        { label: "Tong benh an", value: patients.length },
        { label: "Dang theo doi", value: patients.filter((item) => item.status === "Monitoring").length },
        { label: "Tai kham", value: patients.filter((item) => item.status === "Follow-up").length },
    ];

    const openModal = (mode) => {
        setModalMode(mode);
        setFormData(mode === "edit" && selectedItem ? { ...selectedItem } : { ...emptyPatientForm });
    };

    const handleSubmit = () => {
        if (!formData.id.trim()) {
            return;
        }

        if (modalMode === "edit") {
            setPatients((prev) => prev.map((item) => (item.id === formData.id ? formData : item)));
        } else {
            setPatients((prev) => [formData, ...prev]);
        }

        setSelectedId(formData.id);
        setModalMode("");
    };

    const handleDelete = () => {
        if (!selectedItem) {
            return;
        }

        const canDelete = window.confirm(`Ban co chac muon xoa benh an ${selectedItem.id} khong?`);
        if (!canDelete) {
            return;
        }

        const nextPatients = patients.filter((item) => item.id !== selectedItem.id);
        setPatients(nextPatients);
        setSelectedId(nextPatients[0]?.id || null);
    };

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
                            <h1 style={styles.heroTitle}>Quan ly benh an</h1>
                            <p style={styles.heroText}>Theo doi benh nhan, chan doan, bac si phu trach va cap nhat cac benh an moi nhat.</p>
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
                                <h2 style={styles.panelTitle}>Bang benh an</h2>
                                <div style={{ color: "#66788b" }}>Thao tac them, sua, xoa va xem chi tiet benh an ngay tren trang nay.</div>
                            </div>

                            <div style={styles.actionGroup}>
                                <button type="button" onClick={() => openModal("add")} style={{ ...styles.actionButton, ...styles.primaryButton }}>
                                    <Plus size={18} />
                                    Them moi
                                </button>
                                <button type="button" onClick={() => selectedItem && openModal("edit")} style={{ ...styles.actionButton, ...styles.secondaryButton }}>
                                    <Pencil size={18} />
                                    Sua
                                </button>
                                <button type="button" onClick={handleDelete} style={{ ...styles.actionButton, ...styles.dangerButton }}>
                                    <Trash2 size={18} />
                                    Xoa
                                </button>
                            </div>
                        </div>

                        <div style={styles.tableWrap}>
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={styles.th}>Ma benh an</th>
                                        <th style={styles.th}>Ten benh nhan</th>
                                        <th style={styles.th}>Chan doan</th>
                                        <th style={styles.th}>Bac si phu trach</th>
                                        <th style={styles.th}>Cap nhat</th>
                                        <th style={styles.th}>Trang thai</th>
                                        <th style={styles.th}>Thao tac</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {patients.map((item) => (
                                        <tr
                                            key={item.id}
                                            onClick={() => setSelectedId(item.id)}
                                            style={{ background: selectedItem?.id === item.id ? "#f6fbff" : "#ffffff", cursor: "pointer" }}
                                        >
                                            <td style={styles.td}>{item.id}</td>
                                            <td style={styles.td}>{item.patientName}</td>
                                            <td style={styles.td}>{item.diagnosis}</td>
                                            <td style={styles.td}>{item.doctor}</td>
                                            <td style={styles.td}>{item.updatedAt}</td>
                                            <td style={styles.td}>{renderStatusBadge(item.status)}</td>
                                            <td style={styles.td}>
                                                <button
                                                    type="button"
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        setSelectedId(item.id);
                                                    }}
                                                    style={styles.rowButton}
                                                >
                                                    <Eye size={16} style={{ verticalAlign: "middle", marginRight: "6px" }} />
                                                    Xem chi tiet
                                                </button>
                                            </td>
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
                            <h3 style={styles.detailTitle}>Thong tin chi tiet</h3>
                            {selectedItem && Object.entries(selectedItem).map(([key, value]) => (
                                <div key={key} style={styles.detailRow}>
                                    <div style={styles.detailLabel}>{key}</div>
                                    <div style={styles.detailValue}>{key === "status" ? renderStatusBadge(value) : value}</div>
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
                                <ClipboardPlus size={26} />
                            </div>
                            <h3 style={{ margin: "0 0 12px", color: "#123c69" }}>Khu thao tac</h3>
                            <p style={{ margin: 0, color: "#5f7285", lineHeight: 1.7 }}>
                                File nay chi xu ly benh an. Ban co the dua API benh an vao day ma khong anh huong module role va nguoi dung.
                            </p>
                        </div>
                    </section>
                </main>
            </div>

            {modalMode && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>
                        <h3 style={{ margin: 0, color: "#123c69", fontSize: "24px" }}>
                            {modalMode === "add" ? "Them moi benh an" : "Cap nhat benh an"}
                        </h3>

                        <div style={styles.formGrid}>
                            <div style={styles.field}>
                                <label style={styles.label}>Ma benh an</label>
                                <input style={styles.input} value={formData.id} onChange={(event) => setFormData((prev) => ({ ...prev, id: event.target.value }))} />
                            </div>
                            <div style={styles.field}>
                                <label style={styles.label}>Ten benh nhan</label>
                                <input style={styles.input} value={formData.patientName} onChange={(event) => setFormData((prev) => ({ ...prev, patientName: event.target.value }))} />
                            </div>
                            <div style={{ ...styles.field, ...styles.fieldWide }}>
                                <label style={styles.label}>Chan doan</label>
                                <input style={styles.input} value={formData.diagnosis} onChange={(event) => setFormData((prev) => ({ ...prev, diagnosis: event.target.value }))} />
                            </div>
                            <div style={styles.field}>
                                <label style={styles.label}>Bac si phu trach</label>
                                <input style={styles.input} value={formData.doctor} onChange={(event) => setFormData((prev) => ({ ...prev, doctor: event.target.value }))} />
                            </div>
                            <div style={styles.field}>
                                <label style={styles.label}>Ngay cap nhat</label>
                                <input type="date" style={styles.input} value={formData.updatedAt} onChange={(event) => setFormData((prev) => ({ ...prev, updatedAt: event.target.value }))} />
                            </div>
                            <div style={styles.field}>
                                <label style={styles.label}>Trang thai</label>
                                <select style={styles.input} value={formData.status} onChange={(event) => setFormData((prev) => ({ ...prev, status: event.target.value }))}>
                                    <option value="Stable">Stable</option>
                                    <option value="Follow-up">Follow-up</option>
                                    <option value="Monitoring">Monitoring</option>
                                </select>
                            </div>
                        </div>

                        <div style={styles.modalActions}>
                            <button type="button" onClick={() => setModalMode("")} style={{ ...styles.actionButton, ...styles.secondaryButton }}>
                                Huy
                            </button>
                            <button type="button" onClick={handleSubmit} style={{ ...styles.actionButton, ...styles.primaryButton }}>
                                Luu thong tin
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagePatient;
