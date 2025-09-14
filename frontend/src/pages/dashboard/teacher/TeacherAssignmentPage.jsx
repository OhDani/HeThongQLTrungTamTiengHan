import React, { useEffect, useState } from "react";
import TeacherAssignment from "./TeacherAssignment";
import Card from "../../../components/common/Card";
import { assignmentApi, classApi, courseApi, submissionApi, enrollmentApi, flashcardApi } from "../../../services/api";
import Button from "../../../components/common/Button";
import Modal from "../../../components/common/Modal";
import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { FiList } from "react-icons/fi";
import toast from "../../../components/common/toast";

const TeacherAssignmentPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [currentFlashcards, setCurrentFlashcards] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const fetchAll = async () => {
      const resAssignments = await assignmentApi.getAll();
      setAssignments(resAssignments.filter(a => String(a.user_id) === String(user.user_id)));

      const [cls, crs, enrolls, fcs, resSubs] = await Promise.all([
        classApi.getAll(),
        courseApi.getAll(),
        enrollmentApi.getAll(),
        flashcardApi.getAll(),
        submissionApi.getAll(),
      ]);

      setClasses(cls);
      setCourses(crs);
      setEnrollments(enrolls);
      setFlashcards(fcs);
      setSubmissions(resSubs);
    };

    fetchAll();
  }, [user]);

  const classMap = Object.fromEntries(classes.map(c => [c.class_id, c]));
  const courseMap = Object.fromEntries(courses.map(c => [c.course_id, c.course_name]));

  const baiTaps = assignments.filter(a => a.type === "Bài tập");
  const taiLieus = assignments.filter(a => a.type === "Tài liệu");

  const handleOpenModal = (material_id) => {
    const list = flashcards.filter(f => f.material_id === material_id);
    setCurrentFlashcards(list);
    setOpenModal(true);
  };
  const mapStatusToData = {
  "Đã chấm": "Đã chấm",
  "Chưa nộp": "Chưa nộp",
  "Đã nộp": "Đã nộp",
  "Nộp trễ": "Nộp trễ",
};
const getSubmissionStats = (subs) => {
  return {
    graded: subs.filter(s => s.status === mapStatusToData["Đã chấm"]).length,
    notSubmitted: subs.filter(s => s.status === mapStatusToData["Chưa nộp"]).length,
    submittedButNotGraded: subs.filter(s => s.status === mapStatusToData["Đã nộp"]).length,
    late: subs.filter(s => s.status === mapStatusToData["Nộp trễ"]).length,
  };
};

  const handleDelete = async (item) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa "${item.title}" không?`)) return;

    try {
      await assignmentApi.delete(item.material_id);
      setAssignments(prev => prev.filter(a => a.material_id !== item.material_id));
      toast.success("Xóa thành công!");
    } catch (error) {
      console.error(error);
      toast.error("Xóa thất bại!");
    }
  };

  const calculateStats = (item) => {
  const enrolledStudents = enrollments
    .filter(e => String(e.class_id) === String(item.class_id) && e.status === "Đang học")
    .map(e => e.user_id);

  const subsForItem = submissions.filter(s => String(s.material_id) === String(item.material_id));
  const submissionMap = Object.fromEntries(subsForItem.map(s => [s.user_id, s]));

  const stats = { graded: 0, notSubmitted: 0, submittedButNotGraded: 0, late: 0 };

  const mapStatusToUI = {
    "Đã chấm": "graded",
    "Chưa nộp": "notSubmitted",
    "Đã nộp": "submittedButNotGraded",
    "Nộp trễ": "late",
  };

  enrolledStudents.forEach(uid => {
    const status = submissionMap[uid]?.status || "Chưa nộp";
    const key = mapStatusToUI[status] || "notSubmitted";
    stats[key]++;
  });

  return stats;
};


  return (
    <div className="p-6 bg-blue-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">| Quản lý Bài tập & Tài liệu</h1>
        <div className="flex gap-2">
          
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? "Ẩn" : "+ Thêm bài tập"}
          </Button>
        </div>
      </div>

      {showForm && (
        <TeacherAssignment
          onSuccess={() =>
            assignmentApi.getAll()
              .then(res => setAssignments(res.filter(a => String(a.user_id) === String(user.user_id))))
          }
        />
      )}

      {/* Danh sách Bài tập */}
      <div>
        <h2 className="text-xl font-semibold mb-4">| Danh sách Bài tập</h2>
        {baiTaps.length === 0 ? (
          <p className="text-gray-600 italic">Chưa có bài tập nào do bạn tạo.</p>
        ) : (
          <div className="space-y-6">
            {baiTaps.map(item => {
              const cls = classMap[item.class_id];
              const courseName = cls ? courseMap[cls.course_id] : "";
              const stats = calculateStats(item);

              return (
                <Card key={item.material_id} className="relative">
                  <h3 className="text-xl font-bold text-center mb-2">{cls?.class_name || "Không rõ lớp"} - {courseName || "Không rõ khóa"}</h3>
                  <p className="text-lg font-semibold text-gray-800 mb-4">{item.title}</p>

                  <div className="flex justify-between mb-4 gap-4 flex-wrap">
                    <div
                      className="bg-green-200 text-green-800 px-4 py-2 rounded font-semibold text-center flex-1 min-w-[120px] cursor-pointer"
                      onClick={() =>
                        navigate(`/dashboard/teacher/assignments/${item.material_id}/detail`, { state: { status: "Đã chấm", class_id: item.class_id } })
                      }
                    >
                      <div>Đã chấm</div>
                      <div className="text-lg mt-1">{stats.graded}</div>
                    </div>

                    <div
                      className="bg-red-200 text-red-800 px-4 py-2 rounded font-semibold text-center flex-1 min-w-[120px] cursor-pointer"
                      onClick={() =>
                        navigate(`/dashboard/teacher/assignments/${item.material_id}/detail`, { state: { status: "Chưa nộp", class_id: item.class_id } })
                      }
                    >
                      <div>Chưa nộp</div>
                      <div className="text-lg mt-1">{stats.notSubmitted}</div>
                    </div>

                    <div
                      className="bg-blue-200 text-blue-800 px-4 py-2 rounded font-semibold text-center flex-1 min-w-[120px] cursor-pointer"
                      onClick={() =>
                        navigate(`/dashboard/teacher/assignments/${item.material_id}/detail`, { state: { status: "Đã nộp", class_id: item.class_id } })
                      }
                    >
                      <div>Đã nộp</div>
                      <div className="text-lg mt-1">{stats.submittedButNotGraded}</div>
                    </div>

                    <div
                      className="bg-yellow-200 text-yellow-800 px-4 py-2 rounded font-semibold text-center flex-1 min-w-[120px] cursor-pointer"
                      onClick={() =>
                        navigate(`/dashboard/teacher/assignments/${item.material_id}/detail`, { state: { status: "Nộp trễ", class_id: item.class_id } })
                      }
                    >
                      <div>Nộp trễ</div>
                      <div className="text-lg mt-1">{stats.late}</div>
                    </div>

                  </div>

                  <div className="text-sm text-gray-600 mb-2">Ngày gửi: {item.created_at}</div>
                  <div className="text-sm text-gray-600 mb-4">Hạn nộp: {item.due_date || "Không có"}</div>
                  <p className="text-gray-700 mb-4">{item.description}</p>

                  {item.url && <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline mb-2 block">Xem đề bài</a>}
                  {item.file_url && <a href={`/${item.file_url}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Xem file</a>}

                  <div className="absolute bottom-4 right-4">
                    <Button variant="danger" onClick={() => handleDelete(item)}>Xóa</Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Danh sách Tài liệu */}
      <div className="space-y-6 mt-8">
        <h2 className="text-xl font-semibold mb-4">| Danh sách Tài liệu</h2>
        <p className="mb-4 text-gray-700 font-semibold">Tổng số tài liệu: {taiLieus.length}</p>
        {taiLieus.length === 0 ? (
          <p className="text-gray-600 italic">Chưa có tài liệu nào.</p>
        ) : (
          taiLieus.map(doc => {
            const cls = classMap[doc.class_id];
            const courseName = cls ? courseMap[cls.course_id] : "";
            const category = doc.category || "Khác";
            const vocabCount = flashcards.filter(f => String(f.material_id) === String(doc.material_id)).length;

            return (
              <Card key={doc.material_id} className="relative">
                <h3 className="text-xl font-bold text-center mb-2">{cls?.class_name || "Không rõ lớp"} - {courseName || "Không rõ khóa"}</h3>
                <p className="text-lg font-semibold text-gray-800 mb-2">[{category}] {doc.title}</p>
                <div className="text-sm text-gray-600 mb-2">Ngày gửi: {doc.created_at}</div>

                {category === "Từ vựng" && vocabCount > 0 && (
                  <div className="mb-2 flex items-center gap-2">
                    <span>Số lượng thẻ từ vựng: {vocabCount}</span>
                    <Button onClick={() => handleOpenModal(doc.material_id)}>
                      <FiList className="w-5 h-5" />
                    </Button>
                  </div>
                )}

                {category !== "Từ vựng" && <p className="text-gray-700 mb-2">{doc.description}</p>}
                {doc.file_url && <a href={`/${doc.file_url}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline mb-1 block">Xem file</a>}
                {doc.url && <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Xem URL</a>}

                <div className="absolute bottom-4 right-4">
                  <Button variant="danger" onClick={() => handleDelete(doc)}>Xóa</Button>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Modal danh sách thẻ từ vựng */}
      <Modal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        title="Danh sách thẻ từ vựng"
      >
        {currentFlashcards.length === 0 ? (
          <p>Chưa có thẻ từ vựng nào.</p>
        ) : (
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {currentFlashcards.map(f => (
              <div key={f.flashcard_id} className="border-b py-2">
                <div className="font-semibold">{f.term}</div>
                <div className="text-gray-700">{f.definition}</div>
                {f.image_url && <img src={`/${f.image_url}`} alt={f.term} className="w-20 h-20 object-contain mt-1" />}
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TeacherAssignmentPage;
