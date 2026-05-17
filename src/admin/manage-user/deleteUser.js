import { Trash2 } from "lucide-react";
import { deleteUserById } from "../../axios/user";

const DeleteUser = ({
    adminShellStyles,
    rowId,
    usersDB = [],
    selectedItem,
    setUsersDB,
    setSelectedId,
    setTotalObj,
    setSuccessPopupContent,
    setShowSuccessPopup,
    buttonStyle,
    iconSize = 18,
    label = "Xóa",
    onAfterDelete,
    pageLimit,
    setCurrentPage,
    setTotalPages,
    allUserAndPage
}) => {


    const handleDelete = async (event) => {
        event?.stopPropagation?.();

        const targetItem = rowId
            ? usersDB.find((item) => (item.id || item.idUser) === rowId)
            : selectedItem;

        if (!targetItem) {
            return;
        }

        const targetId = targetItem.id || targetItem.idUser;
        const canDelete = window.confirm(`Ban co chac muon xoa nguoi dung voi id: ${targetId} khong?`);
        if (!canDelete) {
            return;
        }

        // console.log("CHECK ID TO DEL: ", targetId)
        await deleteUserById(`${targetId}`)

        await allUserAndPage?.()

        // const nextUsers = usersDB.filter((item) => (item.id || item.idUser) !== targetId);
        // setUsersDB?.(nextUsers);
        // setSelectedId?.((nextUsers[0] && (nextUsers[0].id || nextUsers[0].idUser)) || null);
        // setTotalObj?.((prev) => Math.max(0, prev - 1));
        setSuccessPopupContent?.({
            title: "Xoa thanh cong",
            text: "Nguoi dung da duoc xoa khoi danh sach.",
        });
        setShowSuccessPopup?.(true);
        // onAfterDelete?.(targetId, nextUsers);
    };

    return (
        <button
            type="button"
            onClick={handleDelete}
            style={buttonStyle || { ...adminShellStyles.actionButton, ...adminShellStyles.dangerButton }}
        >
            <Trash2 size={iconSize} />
            {label}
        </button>
    );
};

export default DeleteUser;
