import React, { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import Card from "../../../components/common/Card";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import Modal from "../../../components/common/Modal";
import Toast from "../../../components/common/Toast";
import { FaEdit, FaLock } from "react-icons/fa";
import { userApi } from "../../../services/api";

const UserProfile = () => {
   const { user, loading: authLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [alertState, setAlertState] = useState({ message: "", type: "info", isVisible: false });
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({}); // New state for password validation errors
  const [currentUserData, setCurrentUserData] = useState(user);

  useEffect(() => {
    if (user) {
      setCurrentUserData(user);
    }
  }, [user]);

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-full text-gray-500">
        Đang tải thông tin...
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
    // Clear the error for the input field being changed
    setPasswordErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleApiAction = async (apiPromise, successMessage) => {
    try {
      const apiResponse = await apiPromise;
      setCurrentUserData(apiResponse);
      setAlertState({ message: successMessage, type: "success", isVisible: true });
    } catch (error) {
      console.error("Lỗi API:", error);
      setAlertState({ message: "Không thể cập nhật. Vui lòng thử lại sau.", type: "error", isVisible: true });
    }
  };

  const handleEditClick = () => {
    if (!isEditing) {
      setFormData({
        username: currentUserData?.username || "",
        role: currentUserData?.role || "",
        full_name: currentUserData?.full_name || "",
        email: currentUserData?.email || "",
        phone: currentUserData?.phone || "",
        address: currentUserData?.address || "",
      });
    }
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    const updatedUser = { ...currentUserData, ...formData };
    handleApiAction(
      userApi.update(user.id, updatedUser),
      "Hồ sơ của bạn đã được cập nhật thành công."
    );
    setIsEditing(false);
  };

  const handleChangePassword = async () => {
    let errors = {};
    if (passwordForm.oldPassword !== currentUserData.password) {
      errors.oldPassword = "Mật khẩu cũ không chính xác.";
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = "Mật khẩu xác nhận không khớp.";
    }
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }
    const updatedPasswordUser = { ...currentUserData, password: passwordForm.newPassword };
    handleApiAction(
      userApi.update(user.id, updatedPasswordUser),
      "Mật khẩu của bạn đã được đổi thành công."
    );
    setShowChangePasswordModal(false);
    setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
  };

  const displayData = isEditing ? { ...currentUserData, ...formData } : currentUserData;

  return (
    <div className="p-6">
      <Card className="w-full max-w-3xl mx-auto shadow-lg rounded-2xl p-6 md:p-10 min-h-[500px]">
        <h2 className="text-2xl font-bold mb-6 text-center">HỒ SƠ CÁ NHÂN</h2>
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full overflow-hidden mb-4 bg-gray-200 flex items-center justify-center">
            <svg
              className="w-16 h-16 text-gray-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.995a4.002 4.002 0 11-8.004 0 4.002 4.002 0 018.004 0z" />
            </svg>
          </div>
        </div>
        
        {alertState.isVisible && (
          <Toast
            message={alertState.message}
            type={alertState.type}
            onClose={() => setAlertState({ ...alertState, isVisible: false })}
          />
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Tên đăng nhập"
            name="username"
            value={displayData.username}
            readOnly={!isEditing}
            onChange={handleInputChange}
          />
          <Input
            label="Vai trò"
            name="role"
            value={displayData.role}
            readOnly
          />
          <Input
            label="Họ và tên"
            name="full_name"
            value={displayData.full_name}
            readOnly={!isEditing}
            onChange={handleInputChange}
          />
          <Input
            label="Email"
            name="email"
            value={displayData.email}
            readOnly={!isEditing}
            onChange={handleInputChange}
          />
          <Input
            label="Số điện thoại"
            name="phone"
            value={displayData.phone}
            readOnly={!isEditing}
            onChange={handleInputChange}
          />
          <Input
            label="Địa chỉ"
            name="address"
            value={displayData.address}
            readOnly={!isEditing}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="flex justify-end mt-6 space-x-2">
          {/* Nút Đổi mật khẩu độc lập */}
          <Button variant="secondary" onClick={() => setShowChangePasswordModal(true)}>
            <FaLock className="inline-block mr-2" />
            Đổi mật khẩu
          </Button>

          {/* Các nút Chỉnh sửa/Lưu hồ sơ */}
          {isEditing ? (
            <>
              <Button variant="secondary" onClick={handleEditClick}>Hủy</Button>
              <Button variant="primary" onClick={handleSave}>Lưu hồ sơ</Button>
            </>
          ) : (
            <Button variant="primary" onClick={handleEditClick}>
              <FaEdit className="inline-block mr-2" /> Chỉnh sửa hồ sơ
            </Button>
          )}
        </div>
      </Card>
      
      <Modal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
        title="Đổi mật khẩu"
        className="w-[400px]"
      >
        <div className="space-y-4">
          <Input
            label="Mật khẩu cũ"
            type="password"
            name="oldPassword"
            value={passwordForm.oldPassword}
            onChange={handlePasswordInputChange}
          />
          {passwordErrors.oldPassword && (
            <p className="text-red-500 text-sm mt-1">{passwordErrors.oldPassword}</p>
          )}
          <Input
            label="Mật khẩu mới"
            type="password"
            name="newPassword"
            value={passwordForm.newPassword}
            onChange={handlePasswordInputChange}
          />
          <Input
            label="Xác nhận mật khẩu mới"
            type="password"
            name="confirmPassword"
            value={passwordForm.confirmPassword}
            onChange={handlePasswordInputChange}
          />
          {passwordErrors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{passwordErrors.confirmPassword}</p>
          )}
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="secondary" onClick={() => setShowChangePasswordModal(false)}>
              Hủy
            </Button>
            <Button variant="primary" onClick={handleChangePassword}>
              Lưu mật khẩu mới
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserProfile;
