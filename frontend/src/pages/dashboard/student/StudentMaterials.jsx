import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../../components/common/Card";
import { HiOutlineViewList } from "react-icons/hi";
import { getStudentAssignments, getStudentClasses } from "../../../services/studentService";

// Icon cho từ vựng và tài liệu
import vocabIcon from "../../../assets/avatar.jpg";
import docIcon from "../../../assets/avatar.jpg";

const StudentMaterials = ({ studentId = 6 }) => { 
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAllVocab, setShowAllVocab] = useState(false);
  const [showAllRef, setShowAllRef] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataAssignments = await getStudentAssignments(studentId);
        const dataClasses = await getStudentClasses(studentId);
        setAssignments(Array.isArray(dataAssignments) ? dataAssignments : []);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [studentId]);

  if (loading) return <div>Đang tải dữ liệu...</div>;
  if (!assignments.length) return <div>Chưa có tài liệu nào.</div>;

  // Filter theo loại
  const vocabularyAssignments = assignments.filter(
    (a) => a.category?.toLowerCase() === "từ vựng"
  );
  const referenceMaterials = assignments.filter(
    (a) =>
      a.type?.toLowerCase() === "tài liệu" &&
      a.category?.toLowerCase() !== "từ vựng"
  );

  // Lọc hiển thị dựa trên toggle
  const displayedVocab = showAllVocab ? vocabularyAssignments : vocabularyAssignments.slice(0, 4);
  const displayedRef = showAllRef ? referenceMaterials : referenceMaterials.slice(0, 2);

  return (
    <div className="p-6 bg-blue-50 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">TÀI LIỆU HỌC TẬP</h2>

      {/* Thông tin tổng hợp */}
      <div className="mb-6 flex gap-4">
        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded">
          Từ vựng: {vocabularyAssignments.length}
        </span>
        <span className="bg-green-100 text-green-700 px-3 py-1 rounded">
          Tài liệu: {referenceMaterials.length}
        </span>
      </div>

      {/* Từ vựng */}
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-semibold">| TỪ VỰNG TỪNG BUỔI HỌC</h3>
        <button
          className="text-sm text-gray-500 hover:text-black transition"
          onClick={() => setShowAllVocab(!showAllVocab)}
        >
          {showAllVocab ? "Thu gọn" : "Xem thêm"}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {displayedVocab.map((a) => (
          <Card
            key={a.id}
            onClick={() => navigate(`/dashboard/student/materials/flashcards/${a.material_id}`)}
            className="flex flex-col items-center p-4 text-center border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 bg-white cursor-pointer"
          >
            <div className="w-full aspect-square mb-2 overflow-hidden rounded-md">
              <img src={vocabIcon} alt={a.title} className="w-full h-full object-cover" />
            </div>
            <div className="font-semibold text-gray-800 mb-1 bg-blue-200 px-4 py-2 rounded-md">{a.title}</div>
            {a.word_count && (
              <div className="flex items-center justify-end w-full text-gray-600 text-xs mt-2 gap-1">
                <HiOutlineViewList className="w-4 h-4" />
                <span>{a.word_count}</span>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Tài liệu tham khảo */}
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-semibold">| TÀI LIỆU THAM KHẢO</h3>
        <button
          className="text-sm text-gray-500 hover:text-black transition"
          onClick={() => setShowAllRef(!showAllRef)}
        >
          {showAllRef ? "Thu gọn" : "Xem thêm"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayedRef.map((a) => (
          <Card key={a.id} className="p-3 flex items-center gap-3">
            <img src={docIcon} alt="doc" className="w-12 h-12" />
            <div>
              <div className="font-semibold">{a.title}</div>
              <div className="text-gray-500 text-sm">{a.description}</div>
              {a.url && (
                <a href={a.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm underline">
                  Xem tài liệu
                </a>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StudentMaterials;
