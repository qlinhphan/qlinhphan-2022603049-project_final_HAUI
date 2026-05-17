import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import DeleteUser from "./deleteUser";

const TableUsers = ({
    adminShellStyles,
    setSelectedId,
    usersDB,
    selectedItem,
    setUsersDB,
    setTotalObj,
    setSuccessPopupContent,
    setShowSuccessPopup,
    allUserAndPage,
    currentPage = 1,
    totalPages = 1,
    totalObj = 0,
    onPageChange,
}) => {
    const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

    return (
        <div>
            <div style={adminShellStyles.tableWrap}>
                <table style={adminShellStyles.table}>
                    <thead>
                        <tr>
                            <th style={adminShellStyles.th}>Mã người dùng</th>
                            <th style={adminShellStyles.th}>Họ tên</th>
                            <th style={adminShellStyles.th}>Email</th>
                            <th style={adminShellStyles.th}>Số điện thoại</th>
                            <th style={adminShellStyles.th}>Vai trò</th>
                            <th style={adminShellStyles.th}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usersDB?.length ? (
                            usersDB.map((item) => {
                                const rowId = item.id || item.idUser;
                                const isSelected =
                                    selectedItem &&
                                    (selectedItem.id === rowId || selectedItem.idUser === rowId);

                                return (
                                    <tr
                                        key={rowId}
                                        onClick={() => setSelectedId(rowId)}
                                        style={{
                                            background: isSelected ? "#f6fbff" : "#ffffff",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <td style={adminShellStyles.td}>{item.idUser}</td>
                                        <td style={adminShellStyles.td}>{item.name}</td>
                                        <td style={adminShellStyles.td}>{item.email}</td>
                                        <td style={adminShellStyles.td}>{item.phone}</td>
                                        <td style={adminShellStyles.td}>{item.roleName}</td>
                                        <td style={adminShellStyles.td}>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "10px",
                                                    flexWrap: "wrap",
                                                }}
                                            >
                                                <button
                                                    type="button"
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        setSelectedId(rowId);
                                                    }}
                                                    style={{
                                                        display: "inline-flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        gap: "8px",
                                                        minWidth: "132px",
                                                        border: "1px solid #cfe0f5",
                                                        background: "#f6fbff",
                                                        color: "#123c69",
                                                        borderRadius: "999px",
                                                        padding: "9px 14px",
                                                        fontSize: "13px",
                                                        fontWeight: 700,
                                                        cursor: "pointer",
                                                        boxShadow: "0 8px 18px rgba(18, 60, 105, 0.08)",
                                                    }}
                                                >
                                                    <Eye size={16} />
                                                    Xem chi tiết
                                                </button>

                                                <DeleteUser
                                                    adminShellStyles={adminShellStyles}
                                                    rowId={rowId}
                                                    usersDB={usersDB}
                                                    selectedItem={selectedItem}
                                                    setUsersDB={setUsersDB}
                                                    setSelectedId={setSelectedId}
                                                    setTotalObj={setTotalObj}
                                                    setSuccessPopupContent={setSuccessPopupContent}
                                                    setShowSuccessPopup={setShowSuccessPopup}
                                                    allUserAndPage={allUserAndPage}
                                                    iconSize={16}
                                                    label="Xoa"
                                                    buttonStyle={{
                                                        display: "inline-flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        gap: "8px",
                                                        minWidth: "96px",
                                                        border: "1px solid #f3c5c5",
                                                        background: "#fff5f5",
                                                        color: "#b42318",
                                                        borderRadius: "999px",
                                                        padding: "9px 14px",
                                                        fontSize: "13px",
                                                        fontWeight: 700,
                                                        cursor: "pointer",
                                                        boxShadow: "0 8px 18px rgba(180, 35, 24, 0.08)",
                                                    }}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={6} style={{ ...adminShellStyles.td, textAlign: "center", color: "#66788b" }}>
                                    Chưa có người dùng nào.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div
                style={{
                    marginTop: "18px",
                    padding: "16px 18px",
                    borderRadius: "18px",
                    border: "1px solid #dceafb",
                    background: "linear-gradient(135deg, #f7fbff 0%, #eef6ff 100%)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "16px",
                    flexWrap: "wrap",
                }}
            >
                <div style={{ color: "#5f7285", fontSize: "14px", fontWeight: 600 }}>
                    Tổng <span style={{ color: "#123c69" }}>{totalObj}</span> người dùng
                </div>

                <div style={{ color: "#5f7285", fontSize: "14px", fontWeight: 600 }}>
                    Trang <span style={{ color: "#123c69" }}>{currentPage}</span> / {totalPages}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                    <button
                        type="button"
                        disabled={currentPage === 1}
                        onClick={() => onPageChange?.(currentPage - 1)}
                        style={{
                            border: "1px solid #d8e6f5",
                            background: currentPage === 1 ? "#f4f7fb" : "#ffffff",
                            color: currentPage === 1 ? "#9aa9b8" : "#123c69",
                            borderRadius: "14px",
                            padding: "10px 14px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            cursor: currentPage === 1 ? "not-allowed" : "pointer",
                            fontWeight: 600,
                        }}
                    >
                        <ChevronLeft size={16} />
                        Trước
                    </button>

                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        {pageNumbers.map((page) => {
                            const isActive = page === currentPage;

                            return (
                                <button
                                    key={page}
                                    type="button"
                                    onClick={() => onPageChange?.(page)}
                                    style={{
                                        minWidth: "42px",
                                        height: "42px",
                                        borderRadius: "14px",
                                        border: isActive ? "none" : "1px solid #d8e6f5",
                                        background: isActive ? "#123c69" : "#ffffff",
                                        color: isActive ? "#ffffff" : "#123c69",
                                        fontWeight: 700,
                                        cursor: "pointer",
                                        boxShadow: isActive ? "0 12px 24px rgba(18, 60, 105, 0.18)" : "none",
                                    }}
                                >
                                    {page}
                                </button>
                            );
                        })}
                    </div>

                    <button
                        type="button"
                        disabled={currentPage === totalPages}
                        onClick={() => onPageChange?.(currentPage + 1)}
                        style={{
                            border: "1px solid #d8e6f5",
                            background: currentPage === totalPages ? "#f4f7fb" : "#ffffff",
                            color: currentPage === totalPages ? "#9aa9b8" : "#123c69",
                            borderRadius: "14px",
                            padding: "10px 14px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                            fontWeight: 600,
                        }}
                    >
                        Sau
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TableUsers;
