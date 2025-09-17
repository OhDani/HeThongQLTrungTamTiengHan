import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import Input from "../../../components/common/Input";
import Select from "../../../components/common/Select";
import TextArea from "../../../components/common/TextArea";
import { useAuth } from "../../../contexts/AuthContext";
import { getStudentClasses, createFeedback } from "../../../services/studentService";
import Toast from "../../../components/common/toast";

const StudentFeedback = () => {
  const { user } = useAuth();
  const studentId = user?.user_id;

  const [classOptions, setClassOptions] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Toast state
  const [toast, setToast] = useState({ message: "", type: "info" });

  // Lấy danh sách lớp học viên đã đăng ký
  useEffect(() => {
    if (!studentId) {
      setLoading(false);
      return;
    }

    const fetchClasses = async () => {
      try {
        const data = await getStudentClasses(studentId);
        const myClasses = Array.isArray(data)
          ? data.map((cls) => ({
              value: cls.class_id,
              label: `${cls.class_name} - ${cls.days} ${cls.time} (${cls.room}) - GV: ${cls.teacher_name}`,
            }))
          : [];

        setClassOptions(myClasses);
      } catch (err) {
        console.error("Lỗi khi lấy lớp:", err);
        setToast({ message: "Không thể tải danh sách lớp!", type: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [studentId]);

  // Submit feedback
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClass || rating === 0) {
      setToast({
        message: "Vui lòng chọn lớp và đánh giá trước khi gửi.",
        type: "error",
      });
      return;
    }

    setSubmitting(true);
    try {
      await createFeedback({
        user_id: studentId,
        class_id: Number(selectedClass),
        rating,
        comment,
      });

      setToast({ message: "Gửi phản hồi thành công!", type: "success" });
      setSelectedClass("");
      setRating(0);
      setHoverRating(0);
      setComment("");
    } catch (err) {
      console.error("Lỗi khi gửi feedback:", err);
      setToast({ message: "Gửi phản hồi thất bại!", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  if (!studentId) {
    return (
      <div className="text-red-500">
        Không xác định học viên. Vui lòng đăng nhập.
      </div>
    );
  }

  if (loading) return <div>Đang tải danh sách lớp...</div>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Hiển thị Toast */}
      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: "", type: "info" })}
        />
      )}

      <h2 className="text-xl font-bold mb-4">Gửi phản hồi về lớp học</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Chọn lớp học"
          id="class"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          options={[{ value: "", label: "-- Chọn lớp --" }, ...classOptions]}
          required
        />

        <div>
          <label className="block mb-1 font-semibold">Đánh giá tổng thể</label>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                size={24}
                className={`cursor-pointer mr-1 ${
                  (hoverRating || rating) >= star
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
              />
            ))}
          </div>
        </div>

        <TextArea
          label={`Nội dung phản hồi (${comment.length}/500)`}
          value={comment}
          onChange={(e) => {
            if (e.target.value.length <= 500) setComment(e.target.value);
          }}
          placeholder="Nhập nội dung phản hồi..."
          rows={5}
          required
        />

        <Input
          type="submit"
          value={submitting ? "Đang gửi..." : "Gửi phản hồi"}
          className={`w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition ${
            submitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={submitting}
        />
      </form>
    </div>
  );
};

export default StudentFeedback;
