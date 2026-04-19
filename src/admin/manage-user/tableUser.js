import { Eye, FileText, Pencil, Plus, ShieldCheck, Trash2, UserCog, Users } from "lucide-react";
const TableUsers = (adminShellStyles, setSelectedId, usersDB, selectedItem) => {
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
                            <th style={adminShellStyles.th}>Role</th>
                            {/* <th style={adminShellStyles.th}>Trang thai</th> */}
                            <th style={adminShellStyles.th}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usersDB?.map((item) => (
                            <tr
                                key={item.id}
                                onClick={() => setSelectedId(item.id)}
                                style={{
                                    background: selectedItem?.id === item.id ? "#f6fbff" : "#ffffff",
                                    cursor: "pointer",
                                }}
                            >
                                <td style={adminShellStyles.td}>{item.id}</td>
                                <td style={adminShellStyles.td}>{item.fullName}</td>
                                <td style={adminShellStyles.td}>{item.email}</td>
                                <td style={adminShellStyles.td}>{item.phone}</td>
                                <td style={adminShellStyles.td}>{item.role}</td>
                                {/* <td style={adminShellStyles.td}>{renderStatusBadge(item.status)}</td> */}
                                <td style={adminShellStyles.td}>
                                    <button
                                        type="button"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            setSelectedId(item.id);
                                        }}
                                        style={adminShellStyles.rowButton}
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
        </div>
    )
}

export default TableUsers