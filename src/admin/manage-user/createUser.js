const CreateUser = ({
    modalMode,
    adminShellStyles,
    formData,
    setFormData,
    closeModal,
    handleSubmit,
}) => {
    const isSubmitDisabled = !formData.email.trim() || !formData.password.trim() || !String(formData.age).trim();

    return (
        <div>
            {modalMode && (
                <div style={adminShellStyles.modalOverlay}>
                    <div style={adminShellStyles.modal}>
                        <h3 style={{ margin: 0, color: "#123c69", fontSize: "24px" }}>
                            {modalMode === "add" ? "Thêm mới người dùng" : "Cập nhật người dùng"}
                        </h3>

                        <div style={adminShellStyles.formGrid}>
                            <div style={adminShellStyles.field}>
                                <label style={adminShellStyles.label}>Email *</label>
                                <input
                                    type="email"
                                    required
                                    style={adminShellStyles.input}
                                    value={formData.email}
                                    onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
                                />
                            </div>
                            <div style={adminShellStyles.field}>
                                <label style={adminShellStyles.label}>Họ và tên</label>
                                <input
                                    style={adminShellStyles.input}
                                    value={formData.name}
                                    onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
                                />
                            </div>
                            <div style={adminShellStyles.field}>
                                <label style={adminShellStyles.label}>Địa chỉ</label>
                                <input
                                    style={adminShellStyles.input}
                                    value={formData.address}
                                    onChange={(event) => setFormData((prev) => ({ ...prev, address: event.target.value }))}
                                />
                            </div>
                            <div style={adminShellStyles.field}>
                                <label style={adminShellStyles.label}>Số điện thoại</label>
                                <input
                                    style={adminShellStyles.input}
                                    value={formData.phone}
                                    onChange={(event) => setFormData((prev) => ({ ...prev, phone: event.target.value }))}
                                />
                            </div>
                            <div style={adminShellStyles.field}>
                                <label style={adminShellStyles.label}>Role</label>
                                <select
                                    style={adminShellStyles.input}
                                    value={formData.roleName}
                                    onChange={(event) => setFormData((prev) => ({ ...prev, roleName: event.target.value }))}
                                >
                                    <option value="admin">Admin</option>
                                    <option value="doctor">Doctor</option>
                                    {/* <option value="Receptionist">Receptionist</option> */}
                                </select>
                            </div>

                            <div style={adminShellStyles.field}>
                                <label style={adminShellStyles.label}>Mật khẩu</label>
                                <input
                                    type="password"
                                    required
                                    style={adminShellStyles.input}
                                    value={formData.password}
                                    onChange={(event) => setFormData((prev) => ({ ...prev, password: event.target.value }))}
                                />
                            </div>
                            <div style={adminShellStyles.field}>
                                <label style={adminShellStyles.label}>Tuổi</label>
                                <input
                                    type="number"
                                    min="0"
                                    required
                                    style={adminShellStyles.input}
                                    value={formData.age}
                                    onChange={(event) => setFormData((prev) => ({ ...prev, age: event.target.value }))}
                                />
                            </div>
                            <div style={adminShellStyles.field}>
                                <label style={adminShellStyles.label}>Giới tính</label>
                                <select
                                    style={adminShellStyles.input}
                                    value={formData.gender}
                                    onChange={(event) => setFormData((prev) => ({ ...prev, gender: event.target.value }))}
                                >
                                    <option value="male">Nam</option>
                                    <option value="female">Nữ</option>
                                    {/* <option value="Receptionist">Receptionist</option> */}
                                </select>
                            </div>



                        </div>

                        <div style={adminShellStyles.modalActions}>
                            <button
                                type="button"
                                onClick={closeModal}
                                style={{ ...adminShellStyles.actionButton, ...adminShellStyles.secondaryButton }}
                            >
                                Huy
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isSubmitDisabled}
                                style={{
                                    ...adminShellStyles.actionButton,
                                    ...adminShellStyles.primaryButton,
                                    opacity: isSubmitDisabled ? 0.6 : 1,
                                    cursor: isSubmitDisabled ? "not-allowed" : "pointer",
                                }}
                            >
                                Luu thong tin
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateUser;
