import React, { useEffect, useState, useCallback } from "react";
import { FiFileText, FiCalendar, FiLink, FiCheckCircle } from "react-icons/fi";
import { getStudentAssignmentsWithStatus } from "../../../services/studentService";
import { useAuth } from "../../../contexts/AuthContext";
import AssignmentModal from "./AssignmentModal";
import { STATUS } from "../../../services/studentService";

const statColors = {
  total: "bg-blue-50 text-blue-700 border-blue-200",
  [STATUS.NOT_SUBMITTED]: "bg-yellow-50 text-yellow-700 border-yellow-200",
  [STATUS.SUBMITTED]: "bg-purple-50 text-purple-700 border-purple-200",
  [STATUS.GRADED]: "bg-green-50 text-green-700 border-green-200",
  [STATUS.LATE_SUBMISSION]: "bg-orange-50 text-orange-700 border-orange-200",
  [STATUS.LATE]: "bg-red-50 text-red-700 border-red-200",
};

const badgeClasses = {
  [STATUS.GRADED]: "bg-green-100 text-green-800",
  [STATUS.SUBMITTED]: "bg-indigo-100 text-indigo-800",
  [STATUS.NOT_SUBMITTED]: "bg-yellow-100 text-yellow-800",
  [STATUS.LATE_SUBMISSION]: "bg-orange-100 text-orange-800",
  [STATUS.LATE]: "bg-red-100 text-red-800",
};

const StudentAssignment = () => {
  const { user, isAuthenticated } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const studentId = user?.user_id;

  const showToast = (message, type = "info") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const fetchAssignments = useCallback(async () => {
    if (!isAuthenticated || !studentId) {
      setError("Không tìm thấy thông tin học viên. Vui lòng đăng nhập lại.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await getStudentAssignmentsWithStatus(studentId);
      setAssignments(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Không thể tải danh sách bài tập.");
      showToast("Không thể tải danh sách bài tập. Vui lòng thử lại!", "error");
    } finally {
      setLoading(false);
    }
  }, [studentId, isAuthenticated]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const handleAssignmentAction = (updatedSubmission) => {
    setAssignments((prev) =>
      prev.map((a) => {
        if (a.material_id === updatedSubmission.material_id) {
          const newStatus = updatedSubmission.grade
            ? STATUS.GRADED
            : updatedSubmission.file_url
            ? STATUS.SUBMITTED
            : STATUS.NOT_SUBMITTED;
          return {
            ...a,
            submission: updatedSubmission.file_url ? updatedSubmission : null,
            grade: updatedSubmission.grade
              ? {
                  assignment_score: updatedSubmission.grade,
                  feedback: updatedSubmission.feedback,
                }
              : null,
            status: newStatus,
          };
        }
        return a;
      })
    );

    showToast(
      updatedSubmission.file_url
        ? updatedSubmission.submission_id
          ? "Cập nhật bài nộp thành công!"
          : "Nộp bài tập thành công!"
        : "Xóa bài nộp thành công!",
      "success"
    );
  };

  const fmtDate = (v) => (v ? new Date(v).toLocaleDateString("vi-VN") : "Không có");
  const fmtDateTime = (v) => (v ? new Date(v).toLocaleString("vi-VN") : "Không có");

  const StatBox = ({ label, value, style }) => (
    <div className={`flex-1 min-w-[120px] border ${style} rounded-lg p-4`}>
      <div className="text-sm">{label}</div>
      <div className="text-2xl font-bold mt-2">{value}</div>
    </div>
  );

  if (loading) return <div className="p-6">Đang tải bài tập...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!assignments.length) return <div className="p-6">Chưa có bài tập nào.</div>;

  const total = assignments.length;
  const countNotSubmitted = assignments.filter((a) => a.status === STATUS.NOT_SUBMITTED).length;
  const countSubmitted = assignments.filter((a) => a.status === STATUS.SUBMITTED).length;
  const countGraded = assignments.filter(a => !!a.grade).length;
  const countLateSubmission = assignments.filter((a) => a.status === STATUS.LATE_SUBMISSION).length;
  const countLate = assignments.filter((a) => a.status === STATUS.LATE).length;

  return (
    <div className="max-w-6xl bg-blue-50 mx-auto p-6 rounded-xl shadow-md relative">
      {toast.show && (
        <div
          className={`fixed top-4 right-4 px-4 py-2 rounded-md shadow-lg text-white ${
            toast.type === "success"
              ? "bg-green-500"
              : toast.type === "error"
              ? "bg-red-500"
              : "bg-blue-500"
          }`}
        >
          {toast.message}
        </div>
      )}

      <h2 className="text-xl font-bold mb-4">BÀI TẬP CỦA TÔI</h2>

      <div className="flex gap-4 mb-6 flex-wrap">
        <StatBox label="Tổng số" value={total} style={statColors.total} />
        <StatBox label="Chưa nộp" value={countNotSubmitted} style={statColors[STATUS.NOT_SUBMITTED]} />
        <StatBox label="Đã nộp (chưa chấm)" value={countSubmitted} style={statColors[STATUS.SUBMITTED]} />
        <StatBox label="Đã chấm" value={countGraded} style={statColors[STATUS.GRADED]} />
        <StatBox label="Nộp trễ" value={countLateSubmission} style={statColors[STATUS.LATE_SUBMISSION]} />
        <StatBox label="Quá hạn" value={countLate} style={statColors[STATUS.LATE]} />
      </div>

      <div className="space-y-6">
        {assignments.map((a) => {
          const key = a.id ?? a.material_id ?? a.title;
          const status = a.status ?? STATUS.NOT_SUBMITTED;
          const isGraded = !!a.grade;

          return (
            <div key={key} className="border rounded-lg p-6 bg-white shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold">{a.title ?? "Không có tiêu đề"}</h3>
                  <span
                    className={`ml-2 inline-flex items-center gap-2 text-sm px-3 py-1 rounded-full ${
                      badgeClasses[status] ?? "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {isGraded && <FiCheckCircle className="text-green-600" />}
                    {status}
                  </span>
                </div>
                <div className="mt-4">
                  {(status === STATUS.NOT_SUBMITTED || status === STATUS.LATE) ? (
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      onClick={() => setSelected({ ...a, mode: "submit" })}
                    >
                      Nộp bài tập
                    </button>
                  ) : (
                    <button
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded transition-colors"
                      onClick={() => setSelected({ ...a, mode: "view" })}
                    >
                      Xem bài đã nộp
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-4 flex items-center gap-6 text-gray-600">
                <div className="flex items-center gap-2">
                  <FiFileText className="w-5 h-5" />
                  <span className="text-sm">{a.course_name ?? a.class_name ?? "Không rõ lớp"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiCalendar className="w-5 h-5" />
                  <span className="text-sm">Hạn: {fmtDate(a.due_date)}</span>
                </div>
              </div>

              {a.description && <p className="mt-4 text-gray-700">{a.description}</p>}
              {(a.url || a.file_url) && (
                <div className="mt-3">
                  <a
                    href={a.url ?? a.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:underline"
                  >
                    <FiLink /> Xem đề bài
                  </a>
                </div>
              )}

              {isGraded && (
                <div className="mt-5 bg-green-50 border border-green-200 rounded p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm text-green-700">Kết quả chấm</div>
                      <div className="text-2xl font-bold text-green-700 mt-2">
                        {Number(a.grade?.assignment_score ?? 0)}/100 điểm
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      <div className="text-xs text-gray-500">Nộp lúc</div>
                      <div className="font-medium">{fmtDateTime(a.submission?.submitted_at)}</div>
                    </div>
                  </div>
                  <hr className="my-3 border-green-200" />
                  <div className="text-green-800">
                    <div className="font-medium">Nhận xét:</div>
                    <div className="text-sm">{a.grade?.feedback ?? "Không có nhận xét."}</div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selected && (
        <AssignmentModal
          assignment={selected}
          user={user} 
          onClose={() => setSelected(null)}
          onAction={handleAssignmentAction}
        />
      )}
    </div>
  );
};

export default StudentAssignment;
