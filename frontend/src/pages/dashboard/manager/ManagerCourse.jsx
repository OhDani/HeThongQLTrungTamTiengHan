import React, { useEffect, useState, useMemo } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import Table from "../../../components/common/Table";
import Button from "../../../components/common/Button";
import Pagination from "../../../components/common/Pagination";
import Toast from "../../../components/common/Toast";
import { courseApi } from "../../../services/api";
import Input from "../../../components/common/Input";
import Textarea from "../../../components/common/TextArea";
import Modal from "../../../components/common/Modal";

const ManagerCourse = () => {
    const [courses, setCourses] = useState([]);
    const [courseFilter, setCourseFilter] = useState("all");

    const [currentPage, setCurrentPage] = useState(1);
    const [toasts, setToasts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [formData, setFormData] = useState({

        course_name: "",
        description: "",
        tuition_fee: "",
        status: ""
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
                const [courseRes] = await Promise.all([
                    courseApi.getAll(),
                ]);
                setCourses(courseRes);
            } catch (error) {
                addToast("Lỗi tải dữ liệu!", "error");
            }
        })();
    }, []);

    const filteredcourses = useMemo(
        () => (courseFilter === "all" ? courses : courses.filter((u) => u.role === courseFilter)),
        [courseFilter, courses]
    );
    const paginatedcourses = useMemo(
        () => filteredcourses.slice((currentPage - 1) * pageSize, currentPage * pageSize),
        [filteredcourses, currentPage]
    );

    const totalPages = Math.ceil(filteredcourses.length / pageSize);

    const handleAdd = () => {
        setEditingCourse(null);
        setFormData({ course_name: "", description: "", start_date: "", end_date: "", tuition_fee: "", status: "" });
        setShowForm(true);
    };

    const handleEdit = (row) => {
        setEditingCourse(row);
        setFormData({ ...row });
        setShowForm(true);
    };

    const handleDelete = async (Course) => {
        const id = getCourseId(Course);
        if (!id) return addToast("ID không hợp lệ!", "error");
        if (window.confirm("Xóa khoá học này?")) {
            try {
                await courseApi.delete(id);
                setCourses((prev) => prev.filter((u) => getCourseId(u) !== id));
                addToast("Xóa thành công!", "success");
            } catch (error) {
                addToast("Lỗi khi xóa!", "error");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const requiredFields = editingCourse ? ["course_name", "description", "start_date", "end_date", "tuition_fee", "status"] : ["course_name", "description", "start_date", "end_date", "tuition_fee", "status"];
        if (requiredFields.some((field) => !formData[field]?.trim())) return addToast("Điền đầy đủ các trường bắt buộc!", "error");

        try {
            let updatedcourses;
            if (editingCourse) {
                const id = getCourseId(editingCourse);
                if (!id) {
                    addToast("Không thể cập nhật do thiếu ID.", "error");
                    return;
                }
                const { id: _, course_id: __, ...dataToUpdate } = data;
                const updatedCourse = await courseApi.update(id, updatedData);
                updatedcourses = courses.map((u) => (getCourseId(u) === id ? { ...u, ...updatedCourse } : u));
                addToast("Cập nhật thành công!", "success");
            } else {
                const newCourse = await courseApi.create(data);
                if (!newCourse || (!newCourse.id && !newCourse.course_id)) {
                    throw new Error("ID không hợp lệ!");
                }
                updatedcourses = [...courses, newCourse];
                addToast("Thêm thành công!", "success");
            }
            setCourses(updatedcourses);
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
        { key: "course_name", label: "Khoá học" },
        { key: "description", label: "Mô tả" },
        { key: "tuition_fee", label: "Học phí/người" },
        { key: "status", label: "Trạng thái" },


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

    return (
        <div className="p-6 bg-blue-50 min-h-screen">
            {toasts.map((toast) => <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))} />)}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-semibold">Quản lý khoá học</h1>
                <Button variant="primary" onClick={handleAdd}>
                    <FaPlus className="inline-block mr-2" /> Thêm khoá học
                </Button>
            </div>
            {paginatedcourses.length ? <Table columns={columns} data={paginatedcourses} /> : <p className="text-gray-500 ">Không có dữ liệu.</p>}
            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}

            <Modal
                isOpen={showForm}
                onClose={() => setShowForm(false)}
                title={editingCourse ? "Sửa khoá học" : "Thêm khoá học"}
                className="w-[800px] max-h-[300vh] overflow-y-auto"
                backdropClassName="bg-gray-600/10 backdrop-blur-sm"
            >
                <div onClick={(e) => e.stopPropagation()}>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            id="course_name"
                            label="Tên khoá học *"
                            type="text"
                            placeholder="Tên khoá học"
                            value={formData.course_name}
                            onChange={(e) => setFormData({ ...formData, course_name: e.target.value })}
                            required
                        />
                        <Input
                            id="description"
                            label="Mô tả *"
                            type="textArea"
                            placeholder="Mô tả"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                        />
                        <Input
                            id="start_date"
                            label="Ngày bắt đầu *"
                            type="date"
                            placeholder="Ngày bắt đầu"
                            value={formData.start_date}
                            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                            autoComplete="start_date"
                            required
                        />
                        <Input
                            id="end_date"
                            label="Ngày kết thúc *"
                            type="date"
                            placeholder="Ngày kết thúc"
                            value={formData.end_date}
                            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                            autoComplete="end_date"
                            required
                        />
                        <Input
                            id="tuition_fee"
                            label="Học phí/người *"
                            type="number"
                            placeholder="Học phí/người"
                            value={formData.tuition_fee}
                            onChange={(e) => setFormData({ ...formData, tuition_fee: e.target.value })}
                            required
                        />
                        <div className="mb-4">
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                            <select
                                id="status"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                required
                            >
                                <option value="Đang mở">Đang mở</option>
                                <option value="Chưa mở">Chưa mở</option>
                                <option value="Hoàn thành">Hoàn thành</option>
                            </select>
                        </div>

                        {!editingCourse && (
                            <>
                                <Input
                                    id="status"
                                    label="Trạng thái *"
                                    type="text"
                                    placeholder="Trạng thái"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    required
                                />

                            </>
                        )}
                        <div className="col-span-1 md:col-span-2 flex justify-end gap-2 mt-4">
                            <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Hủy</Button>
                            <Button type="submit" variant="primary">{editingCourse ? "Cập nhật" : "Thêm mới"}</Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
};

export default ManagerCourse;