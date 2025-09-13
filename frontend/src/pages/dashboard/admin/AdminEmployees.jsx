import React, { useEffect, useState, useMemo } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import Table from "../../../components/common/Table";
import Select from "../../../components/common/Select";
import Button from "../../../components/common/Button";
import Pagination from "../../../components/common/Pagination";
import Toast from "../../../components/common/Toast";
import { userApi } from "../../../services/api";
import Input from "../../../components/common/Input";
import Textarea from "../../../components/common/Textarea";
import Modal from "../../../components/common/Modal";

const AdminEmployees = () => {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [toasts, setToasts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    role: "Giảng viên",
    note: "",
    username: "",
    password: "",
  });

  const pageSize = 10;

  const addToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  };

  const getUserId = (user) => user.id || user.user_id;

  useEffect(() => {
    (async () => {
      try {
        const res = await userApi.getAll();
        const validUsers = Array.isArray(res) ? res.filter(u => u && (u.role !== "Học viên")) : [];
        setUsers(validUsers);
      } catch (error) {
        console.error("API Error:", error);
        addToast("Lỗi tải danh sách!", "error");
      }
    })();
  }, []);

  const filteredUsers = useMemo(
    () => (roleFilter === "all" ? users : users.filter((u) => u.role === roleFilter)),
    [roleFilter, users]
  );

  const paginatedUsers = useMemo(
    () => filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [filteredUsers, currentPage]
  );

  const totalPages = Math.ceil(filteredUsers.length / pageSize);

  const handleAdd = () => {
    setEditingUser(null);
    setFormData({ full_name: "", email: "", phone: "", address: "", role: "Giảng viên", note: "", username: "", password: "" });
    setShowForm(true);
  };

  const handleEdit = (row) => {
    setEditingUser(row);
    const safeRow = { ...row }; // password không cần, bỏ hoàn toàn
    setFormData(safeRow);
    setShowForm(true);
  };

  const handleDelete = async (user) => {
    const id = getUserId(user);
    if (!id) return addToast("ID không hợp lệ!", "error");
    if (window.confirm(`Xóa nhân viên "${user.full_name}" (ID: ${id})?`)) {
      try {
        await userApi.delete(id);
        setUsers((prev) => prev.filter((u) => getUserId(u) !== id));
        addToast("Xóa thành công!", "success");
      } catch (error) {
        addToast("Lỗi khi xóa! " + (error.message || "Thử lại."), "error");
      }
    }
  };

  const handlePhoneChange = (value) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length > 10 || (!digits.startsWith('09') && !digits.startsWith('03'))) return value;
    const formatted = digits.length > 7 ? `${digits.slice(0,3)} ${digits.slice(3,7)} ${digits.slice(7,10)}` :
      digits.length > 3 ? `${digits.slice(0,3)} ${digits.slice(3)}` : digits;
    return formatted.slice(0, 12);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const requiredFields = editingUser ? ["full_name", "email"] : ["full_name", "email", "username", "password"];
    if (requiredFields.some(f => !formData[f]?.trim())) {
      addToast("Vui lòng điền đầy đủ các trường bắt buộc!", "error");
      setIsLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      addToast("Email không hợp lệ!", "error");
      setIsLoading(false);
      return;
    }

    try {
      let updatedUsers;
      if (editingUser) {
        const id = getUserId(editingUser);
        const existingUser = users.find(u => getUserId(u) === id);
        if (!existingUser) {
          addToast("Không tìm thấy người dùng để cập nhật!", "error");
          setIsLoading(false);
          return;
        }

        const dataToUpdate = { ...existingUser, ...formData };
        delete dataToUpdate.id;
        delete dataToUpdate.user_id;

        const updatedUser = await userApi.update(id, dataToUpdate);
        updatedUsers = users.map(u => getUserId(u) === id ? updatedUser : u);
        addToast("Cập nhật thành công!", "success");
      } else {
        const newUser = await userApi.create(formData);
        updatedUsers = [...users, newUser];
        addToast("Thêm thành công!", "success");
      }
      setUsers(updatedUsers);
      setShowForm(false);
      setFormData({ full_name: "", email: "", phone: "", address: "", role: "Giảng viên", note: "", username: "", password: "" });
    } catch (err) {
      console.error("Lỗi khi cập nhật/thêm:", err);
      addToast("Lỗi khi cập nhật/thêm! " + (err.message || "Vui lòng thử lại."), "error");
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    { key: "full_name", label: "Họ Tên" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Số Điện Thoại" },
    { key: "role", label: "Chức Vụ" },
    {
      key: "actions",
      label: "Hành Động",
      render: (row) => (
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => handleEdit(row)} disabled={isLoading}>
            <FaEdit className="text-sm" />
          </Button>
          <Button variant="danger" onClick={() => handleDelete(row)} disabled={isLoading}>
            <FaTrash className="text-sm" />
          </Button>
        </div>
      ),
    },
  ];

  const roleOptions = [
    { value: "all", label: "Tất cả" },
    { value: "Quản lý hệ thống", label: "Quản lý hệ thống" },
    { value: "Quản lý học vụ", label: "Quản lý học vụ" },
    { value: "Giảng viên", label: "Giảng viên" },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
        />
      ))}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Quản lý nhân viên</h1>
        <Button variant="primary" onClick={handleAdd} disabled={isLoading}>
          <FaPlus className="inline-block mr-2" /> Thêm nhân viên
        </Button>
      </div>
      <Select
        id="roleFilter"
        label="Lọc theo chức vụ:"
        value={roleFilter}
        onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
        options={roleOptions}
        className="w-48 mb-4"
      />
      {paginatedUsers.length ? (
        <Table columns={columns} data={paginatedUsers} />
      ) : (
        <p className="text-gray-500">Không có dữ liệu.</p>
      )}
      {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}

      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setFormData({ full_name: "", email: "", phone: "", address: "", role: "Giảng viên", note: "", username: "", password: "" });
        }}
        title={editingUser ? "Sửa nhân viên" : "Thêm nhân viên"}
        className="w-[800px] max-h-[95vh] overflow-y-auto"
        backdropClassName="bg-gray-600/10 backdrop-blur-sm"
      >
        <div onClick={(e) => e.stopPropagation()}>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              id="full_name"
              label="Họ tên *"
              type="text"
              placeholder="Họ tên"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              required
              disabled={isLoading}
            />
            <Input
              id="email"
              label="Email *"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              autoComplete="email"
              required
              disabled={isLoading}
            />
            <Input
              id="phone"
              label="Số điện thoại"
              type="tel"
              placeholder="0123 456 789"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: handlePhoneChange(e.target.value) })}
              autoComplete="tel"
              disabled={isLoading}
            />
            <Input
              id="address"
              label="Địa chỉ"
              type="text"
              placeholder="Địa chỉ"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              disabled={isLoading}
            />
            <div className="mb-4">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Chức vụ</label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
                disabled={isLoading}
              >
                <option value="Quản lý hệ thống">Quản lý hệ thống</option>
                <option value="Quản lý học vụ">Quản lý học vụ</option>
                <option value="Giảng viên">Giảng viên</option>
              </select>
            </div>
            {!editingUser && (
              <>
                <Input
                  id="username"
                  label="Tên đăng nhập *"
                  type="text"
                  placeholder="Tên đăng nhập"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  autoComplete="username"
                  required
                  disabled={isLoading}
                />
                <Input
                  id="password"
                  label="Mật khẩu *"
                  type="password"
                  placeholder="Mật khẩu"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  autoComplete="new-password"
                  required
                  disabled={isLoading}
                />
              </>
            )}
            <div className="col-span-1 md:col-span-2">
              <Textarea
                label="Ghi chú"
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                placeholder="Ghi chú"
                name="note"
                rows={2}
                disabled={isLoading}
              />
            </div>
            <div className="col-span-1 md:col-span-2 flex justify-end gap-2 mt-4">
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)} disabled={isLoading}>
                Hủy
              </Button>
              <Button type="submit" variant="primary" disabled={isLoading}>
                {isLoading ? "Đang xử lý..." : (editingUser ? "Cập nhật" : "Thêm mới")}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default AdminEmployees;
