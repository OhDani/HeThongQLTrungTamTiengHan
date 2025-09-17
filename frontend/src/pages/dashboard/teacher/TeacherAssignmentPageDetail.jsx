import { useParams, useLocation } from "react-router-dom";
import { submissionApi, enrollmentApi, userApi } from "../../../services/api";
import { useEffect, useState } from "react";
import Button from "../../../components/common/Button";

const TeacherAssignmentPageDetail = () => {
  const { materialId } = useParams();
  const location = useLocation();
  const statusFilter = location.state?.status || "";
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subs, enrolls, users] = await Promise.all([
          submissionApi.getAll(),
          enrollmentApi.getAll(),
          userApi.getAll(),
        ]);

        // Map user_id => full_name
        const userMap = Object.fromEntries(users.map(u => [u.user_id, u.full_name]));

        // Filter submissions của material này
        let filteredSubs = subs.filter(
          s => String(s.material_id) === String(materialId) &&
            (statusFilter ? s.status === statusFilter : true)
        );

        // Thêm full_name
        filteredSubs = filteredSubs.map(s => ({
          ...s,
          full_name: userMap[s.user_id] || `Học viên ${s.user_id}`,
        }));

        // Thêm học viên chưa nộp nếu cần
        if (statusFilter === "Chưa nộp" || statusFilter === "") {
          const classId = filteredSubs[0]?.class_id || 1;
          const enrolledStudents = enrolls
            .filter(e => String(e.class_id) === String(classId) && e.status === "Đang học")
            .map(e => e.user_id);

          enrolledStudents.forEach(uid => {
            if (!filteredSubs.some(s => s.user_id === uid)) {
              filteredSubs.push({
                submission_id: null,
                material_id: materialId,
                user_id: uid,
                full_name: userMap[uid] || `Học viên ${uid}`,
                file_url: null,
                submitted_at: null,
                grade: null,
                feedback: null,
                corrected_file_url: null,
                status: "Chưa nộp",
              });
            }
          });
        }

        // Sắp xếp theo thứ tự
        const order = ["Đã chấm", "Chưa nộp", "Đã nộp", "Nộp trễ"];
        filteredSubs.sort((a, b) => order.indexOf(a.status) - order.indexOf(b.status));

        setSubmissions(filteredSubs);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [materialId, statusFilter]);

  const renderGrade = (grade) => {
    if (grade === null) return "-";
    if (grade === 100) return <span className="bg-green-600 text-white px-2 rounded">{grade}</span>;
    if (grade >= 50) return <span className="bg-blue-500 text-white px-2 rounded">{grade}</span>;
    return <span className="bg-red-500 text-white px-2 rounded">{grade}</span>;
  };

  return (
    <div className="p-6 bg-blue-50 min-h-screen"><h1 className="text-2xl font-bold mb-6">
      Danh sách học sinh: {statusFilter || "Tất cả"}
    </h1>

      {submissions.length === 0 ? (
        <p>Chưa có học sinh nào.</p>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">STT</th>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Họ tên</th>
                {(statusFilter === "Đã chấm" || statusFilter === "") && <th className="px-4 py-2 text-left">Điểm</th>}
                {(statusFilter === "Đã chấm" || statusFilter === "") && <th className="px-4 py-2 text-left">Nhận xét</th>}
                {(statusFilter === "Đã chấm" || statusFilter === "") && <th className="px-4 py-2 text-left">Bài sửa</th>}
                {(statusFilter === "Chưa nộp" || statusFilter === "") && <th className="px-4 py-2 text-left">Thời gian nộp</th>}
                {(statusFilter === "Chưa nộp" || statusFilter === "") && <th className="px-4 py-2 text-left">Hạn nộp</th>}
                {(statusFilter === "Chưa nộp" || statusFilter === "") && <th className="px-4 py-2 text-left">Bài nộp</th>}
                {(statusFilter === "Đã nộp" || statusFilter === "Nộp trễ") && <th className="px-4 py-2 text-left">Thời gian nộp</th>}
                {(statusFilter === "Đã nộp" || statusFilter === "Nộp trễ") && <th className="px-4 py-2 text-left">Hạn nộp</th>}
                {(statusFilter === "Đã nộp" || statusFilter === "Nộp trễ") && <th className="px-4 py-2 text-left">Bài nộp</th>}
                {(statusFilter === "Đã nộp" || statusFilter === "Nộp trễ") && <th className="px-4 py-2 text-left">Hành động</th>}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {submissions.map((s, idx) => (
                <tr key={s.submission_id || s.user_id || idx} className="hover:bg-gray-100">
                  <td className="px-4 py-2">{idx + 1}</td>
                  <td className="px-4 py-2">{s.user_id}</td>
                  <td className="px-4 py-2">{s.full_name}</td>

                  {(statusFilter === "Đã chấm" || statusFilter === "") && <td className="px-4 py-2">{renderGrade(s.grade)}</td>}
                  {(statusFilter === "Đã chấm" || statusFilter === "") && <td className="px-4 py-2">{s.feedback || "-"}</td>}
                  {(statusFilter === "Đã chấm" || statusFilter === "") &&
                    <td className="px-4 py-2">
                      {s.corrected_file_url ? <a href={`/${s.corrected_file_url}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Xem</a> : "-"}
                    </td>
                  }{(statusFilter === "Chưa nộp" || statusFilter === "") &&
                    <td className="px-4 py-2 text-red-600 font-semibold">{s.submitted_at || "Không có"}</td>
                  }
                  {(statusFilter === "Chưa nộp" || statusFilter === "") &&
                    <td className="px-4 py-2">{s.due_date || "-"}</td>
                  }
                  {(statusFilter === "Chưa nộp" || statusFilter === "") &&
                    <td className="px-4 py-2 text-red-600 font-semibold">{s.file_url ? <a href={`/${s.file_url}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Xem</a> : "Sinh viên không nộp bài"}</td>
                  }

                  {(statusFilter === "Đã nộp" || statusFilter === "Nộp trễ") &&
                    <td className={`px-4 py-2 ${s.status === "Nộp trễ" ? "bg-yellow-200" : ""}`}>{s.submitted_at || "-"}</td>
                  }
                  {(statusFilter === "Đã nộp" || statusFilter === "Nộp trễ") && <td className="px-4 py-2">{s.due_date || "-"}</td>}
                  {(statusFilter === "Đã nộp" || statusFilter === "Nộp trễ") &&
                    <td className="px-4 py-2">{s.file_url ? <a href={`/${s.file_url}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Xem</a> : "-"}</td>
                  }
                  {(statusFilter === "Đã nộp" || statusFilter === "Nộp trễ") &&
                    <td className="px-4 py-2">
                      {s.submission_id ? <Button onClick={() => alert(`Sửa bài học sinh ID ${s.user_id}`)}>Sửa bài tập</Button> : "-"}
                    </td>
                  }
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TeacherAssignmentPageDetail;