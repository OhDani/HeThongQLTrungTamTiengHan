import React, { useEffect, useState } from "react";
import {
  getStudentClasses,
  createFeedback,
} from "../../../services/studentService";
import { FaStar } from "react-icons/fa";
import Input from "../../../components/common/Input";
import Select from "../../../components/common/Select";
import TextArea from "../../../components/common/TextArea";
import Alert from "../../../components/common/Alert";

const StudentFeedback = ({ studentId = 6 }) => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const data = await getStudentClasses(studentId);
        console.log("Fetched classes:", data); // Debug log
        setClasses(
          Array.isArray(data)
            ? data.map((cls) => ({
                value: cls.class_id || cls.id,
                label: cls.class_name,
              }))
            : []
        );
      } catch (err) {
        console.error("Error fetching classes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, [studentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClass || rating === 0) {
      Alert("Vui lòng chọn lớp và đánh giá trước khi gửi.");
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
      Alert("Gửi phản hồi thành công!");
      setSelectedClass("");
      setRating(0);
      setHoverRating(0);
      setComment("");
    } catch (err) {
      console.error("Error creating feedback:", err);
      alert("Gửi phản hồi thất bại!");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Đang tải lớp học...</div>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Gửi phản hồi về lớp học</h2>
      {classes.length === 0 && (
        <div className="mb-4 p-3 bg-yellow-100 text-yellow-700 rounded">
          Học viên chưa đăng ký lớp học nào.
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Chọn lớp học"
          id="class"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          options={[
            { value: "", label: "-- Chọn lớp --" },
            ...classes // ← FIX: Sử dụng trực tiếp classes array đã được map
          ]}
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