import React, { useState, useEffect } from "react"; 
import { useParams, useNavigate } from "react-router-dom";
import Table from "../../../components/common/Table";
import Alert from "../../../components/common/Alert";
import Button from "../../../components/common/Button";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import TextArea from "../../../components/common/TextArea";
import { userApi, enrollmentApi } from "../../../services/api";
import { useAuth } from "../../../contexts/AuthContext";
import { ArrowLeft } from "lucide-react";

const TeacherClassStudents = () => {
  const { classId } = useParams();
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      setError("Vui lòng đăng nhập để xem dữ liệu.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [users, enrollments] = await Promise.all([
          userApi.getAll(),
          enrollmentApi.getAll(),
        ]);

        const classStudents = enrollments
          .filter((en) => en.class_id === parseInt(classId))
          .map((en) => users.find((u) => u.user_id === en.user_id))
          .filter(Boolean);

        setStudents(classStudents);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, classId]);

  if (loading) return <LoadingSpinner />;
  if (error) return <Alert message={error} type="error" />;

  const handleNoteChange = async (userId, newNote) => {
    try {
      setStudents((prev) =>
        prev.map((s) => (s.user_id === userId ? { ...s, note: newNote } : s))
      );
      await userApi.updateByUserId(userId, { note: newNote });
      console.log("Đã lưu ghi chú cho user:", userId);
    } catch (err) {
      console.error("Lỗi khi lưu ghi chú:", err);
    }
  };

  const columns = [
    { key: "stt", label: "STT", render: (_, index) => index + 1 },
    { key: "user_id", label: "ID" },
    { key: "full_name", label: "Họ và tên" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Số điện thoại" },
    { key: "address", label: "Địa chỉ" },
    {
      key: "note",
      label: "Ghi chú",
      render: (item) => (
        <TextArea
          value={item.note || ""}
          onChange={(e) => handleNoteChange(item.user_id, e.target.value)}
          className="w-full"
          rows={2}
        />
      ),
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <main className="flex-1 overflow-x-hidden overflow-y-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            Danh sách học viên - Lớp {classId}
          </h1>
          <Button onClick={() => navigate(`/dashboard/teacher/enter-grades/${classId}`)}>
            Nhập điểm
          </Button>
        </div>

        <Table
          columns={columns}
          data={students}
          rowClassName={(index) => (index % 2 === 0 ? "bg-gray-100" : "bg-white")}
        />

        <div className="mt-6">
          <button
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
            onClick={() => navigate("/dashboard/teacher/classes")}
          >
            <ArrowLeft size={20} /> Quay lại danh sách lớp học
          </button>
        </div>
      </main>
    </div>
  );
};

export default TeacherClassStudents;
