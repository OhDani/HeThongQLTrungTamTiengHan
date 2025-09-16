import React, { useEffect, useState, useMemo } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import Table from "../../../components/common/Table";
import Select from "../../../components/common/Select";
import Button from "../../../components/common/Button";
import Pagination from "../../../components/common/Pagination";
import Toast from "../../../components/common/Toast";
import { userApi, classApi, enrollmentApi } from "../../../services/api"; // Giả sử có các API này
import Input from "../../../components/common/Input";
import Textarea from "../../../components/common/TextArea"; // Sửa lại từ TextArea thành Textarea
import Modal from "../../../components/common/Modal";

const ManagerStudent = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [classFilter, setClassFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [toasts, setToasts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
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

  useEffect(() => {
    (async () => {
      try {
        const [userRes, classRes, enrollmentRes] = await Promise.all([
          userApi.getAll(),
          classApi.getAll(),
          enrollmentApi.getAll(),
        ]);
        setStudents(userRes.filter((u) => u.role === "Học viên"));
        setClasses(classRes);
        setEnrollments(enrollmentRes);
      } catch (error) {
        addToast("Lỗi tải dữ liệu!", "error");
      }
    })();
  }, []);

  const filteredStudents = useMemo(() => {
    if (classFilter === "all") return students;
    const enrolledUserIds = enrollments
      .filter((e) => e.class_id === parseInt(classFilter))
      .map((e) => e.user_id);
    return students.filter((s) => enrolledUserIds.includes(s.user_id));
  }, [classFilter, students, enrollments]);

  const paginatedStudents = useMemo(
    () => filteredStudents.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [filteredStudents, currentPage]
  );

  const totalPages = Math.ceil(filteredStudents.length / pageSize);

  const getUserId = (student) => student.id || student.user_id;

  const handleAdd = () => {
    setEditingStudent(null);
    setFormData({ full_name: "", email: "", phone: "", address: "", note: "", username: "", password: "" });
    setShowForm(true);
  };

  const handleEdit = (row) => {
    setEditingStudent(row);
    // Giữ nguyên password cũ nếu không thay đổi
    const originalPassword = row.password || ""; // Lấy password từ dữ liệu gốc
    setFormData({ ...row, password: originalPassword });
    setShowForm(true);
  };

  const handleDelete = async (student) => {
    const id = getUserId(student);
    if (!id) return addToast("ID không hợp lệ!", "error");
    if (window.confirm("Xóa học viên này?")) {
      try {
        await userApi.delete(id);
        setStudents((prev) => prev.filter((u) => getUserId(u) !== id));
        addToast("Xóa thành công!", "success");
      } catch (error) {
        addToast("Lỗi khi xóa!", "error");
      }
    }
  };

  const handlePhoneChange = (value) => {
    const digits = value.replace(/\D/g, "");
    const formatted = digits.length > 7 ? `${digits.slice(0, 3)} ${digits.slice(3, 7)} ${digits.slice(7, 10)}` : digits.length > 3 ? `${digits.slice(0, 3)} ${digits.slice(3)}` : digits;
    return formatted.slice(0, 12);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requiredFields = editingStudent ? ["full_name", "email"] : ["full_name", "email", "username", "password"];
    if (requiredFields.some((field) => !formData[field]?.trim())) return addToast("Điền đầy đủ các trường bắt buộc!", "error");
    if (formData.phone && !/^0[0-9]{9}$/.test(formData.phone.replace(/\s/g, ""))) return addToast("Số điện thoại không hợp lệ!", "error");

    try {
      const data = { ...formData, phone: formData.phone.replace(/\s/g, ""), role: "Học viên" };
      let updatedStudents;
      if (editingStudent) {
        const id = getUserId(editingStudent);
        if (!id) {
          addToast("Không thể cập nhật do thiếu ID.", "error");
          return;
        }
        const { id: _, user_id: __, ...dataToUpdate } = data;
        // Nếu password không được nhập (vẫn là giá trị cũ), giữ nguyên password từ dữ liệu gốc
        const updatedData = formData.password.trim() === "" ? { ...dataToUpdate, password: editingStudent.password } : dataToUpdate;
        const updatedStudent = await userApi.update(id, updatedData);
        updatedStudents = students.map((u) => (getUserId(u) === id ? { ...u, ...updatedStudent } : u));
        addToast("Cập nhật thành công!", "success");
      } else {
        const newStudent = await userApi.create(data);
        if (!newStudent || (!newStudent.id && !newStudent.user_id)) {
          throw new Error("ID không hợp lệ!");
        }
        updatedStudents = [...students, newStudent];
        addToast("Thêm thành công!", "success");
      }
      setStudents(updatedStudents);
      setShowForm(false);
    } catch (err) {
      addToast("Lỗi khi cập nhật/thêm!", "error");
    }
  };

  const columns = [
    {
      key: "stt",
      label: "STT",
      render: (_, index) => (currentPage - 1) * pageSize + index + 1,
    },
    { key: "full_name", label: "Tên" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Số Điện Thoại" },
    // Loại bỏ cột "Trình Trạng" theo yêu cầu
    {
      key: "actions",
      label: "Hành Động",
      render: (row) => (
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => handleEdit(row)}><FaEdit className="text-sm" /></Button>
          <Button variant="danger" onClick={() => handleDelete(row)}><FaTrash className="text-sm" /></Button>
        </div>
      ),
    },
  ];

  const classOptions = useMemo(
    () => [
      { value: "all", label: "Tất cả" },
      ...classes.map((c) => ({ value: c.class_id.toString(), label: c.class_name })),
    ],
    [classes]
  );

  return (
    <div className="p-6 bg-blue-50 min-h-screen">
      {toasts.map((toast) => <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))} />)}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Quản lý học viên</h1>
        <Button variant="primary" onClick={handleAdd}>
          <FaPlus className="inline-block mr-2" /> Thêm học viên
        </Button>
      </div>
      <div className="w-64 mb-4">
      <Select
        id="classFilter"
        label="Lọc theo lớp học:"
        value={classFilter}
        onChange={(e) => { setClassFilter(e.target.value); setCurrentPage(1); }}
        options={classOptions}
      />
      </div>
      {paginatedStudents.length ? <Table columns={columns} data={paginatedStudents} /> : <p className="text-gray-500">Không có dữ liệu.</p>}
      {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}

      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={editingStudent ? "Sửa học viên" : "Thêm học viên"}
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
            />
            <Input
              id="phone"
              label="Số điện thoại"
              type="tel"
              placeholder="0123 456 789"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: handlePhoneChange(e.target.value) })}
              autoComplete="tel"
            />
            <Input
              id="address"
              label="Địa chỉ"
              type="text"
              placeholder="Địa chỉ"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
            {!editingStudent && (
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
              />
            </div>
            <div className="col-span-1 md:col-span-2 flex justify-end gap-2 mt-4">
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Hủy</Button>
              <Button type="submit" variant="primary">{editingStudent ? "Cập nhật" : "Thêm mới"}</Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default ManagerStudent;