// TeacherEnterGrades.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../../components/common/Card';
import Alert from '../../../components/common/Alert';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import { userApi, enrollmentApi, gradeApi } from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';

const gradeGroups = [
  { label: "Chuyên cần", fields: [{ scoreKey: "attendance_score", remarkKey: "attendance_remark" }] },
  { label: "Bài tập", fields: [{ scoreKey: "assignment_score", remarkKey: "assignment_remark" }] },
  {
    label: "Giữa kỳ",
    fields: [
      { label: "Nghe", scoreKey: "midterm_listening", remarkKey: "midterm_listening_remark" },
      { label: "Nói", scoreKey: "midterm_speaking", remarkKey: "midterm_speaking_remark" },
      { label: "Đọc", scoreKey: "midterm_reading", remarkKey: "midterm_reading_remark" },
      { label: "Viết", scoreKey: "midterm_writing", remarkKey: "midterm_writing_remark" }
    ]
  },
  {
    label: "Cuối kỳ",
    fields: [
      { label: "Nghe", scoreKey: "final_listening", remarkKey: "final_listening_remark" },
      { label: "Nói", scoreKey: "final_speaking", remarkKey: "final_speaking_remark" },
      { label: "Đọc", scoreKey: "final_reading", remarkKey: "final_reading_remark" },
      { label: "Viết", scoreKey: "final_writing", remarkKey: "final_writing_remark" }
    ]
  }
];

const TeacherEnterGrades = () => {
  const { classId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState({});
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    if (!user) {
      setAlert({ type: "error", message: "Vui lòng đăng nhập để xem dữ liệu." });
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [users, enrollments, gradesResponse] = await Promise.all([
          userApi.getAll(),
          enrollmentApi.getAll(),
          gradeApi.getAll()
        ]);

        const studentsInClass = enrollments
          .filter(e => e.class_id === parseInt(classId))
          .map(e => {
            const student = users.find(u => u.user_id === e.user_id);
            return student ? { ...student, enrollment_id: e.enrollment_id } : null;
          })
          .filter(Boolean);

        setStudents(studentsInClass);

        const gradesObj = {};
        studentsInClass.forEach(student => {
          const g = gradesResponse.find(
            g => g.user_id === student.user_id && g.class_id === parseInt(classId)
          );
          gradesObj[student.user_id] = g
            ? { ...g }
            : { user_id: student.user_id, class_id: parseInt(classId), id: '', overall_avg: '' };
        });

        setGrades(gradesObj);
      } catch (err) {
        console.error(err);
        setAlert({ type: "error", message: "Không thể tải dữ liệu. Vui lòng thử lại sau." });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, classId]);

  const handleGradeChange = (studentId, key, value) => {
    setGrades(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], [key]: value }
    }));
  };

  const calculateAverage = (studentId) => {
    const studentGrades = grades[studentId];
    if (!studentGrades) return 0;
    const scoreKeys = gradeGroups.flatMap(g => g.fields.map(f => f.scoreKey));
    const scores = scoreKeys.map(k => parseFloat(studentGrades[k])).filter(s => !isNaN(s));
    if (!scores.length) return 0;
    return (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
  };

  const handleSaveGrade = async (studentId) => {
    try {
      setLoading(true);
      const gradeData = { ...grades[studentId], overall_avg: calculateAverage(studentId) };
      if (gradeData.id) {
        await gradeApi.update(gradeData.id, gradeData);
      } else {
        const newGrade = await gradeApi.create(gradeData);
        setGrades(prev => ({ ...prev, [studentId]: newGrade }));
      }
      setAlert({
        type: "success",
        message: `Điểm học viên "${students.find(s => s.user_id === studentId)?.full_name}" đã được lưu!`
      });
      setTimeout(() => setAlert(null), 3000);
    } catch (err) {
      console.error(err);
      setAlert({ type: "error", message: "Không thể lưu điểm. Vui lòng thử lại!" });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex h-screen bg-gray-100">
      <main className="flex-1 overflow-auto p-4">
        {alert && (
          <div className="fixed top-4 right-4 z-50">
            <Alert message={alert.message} type={alert.type} />
          </div>
        )}

        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Nhập điểm - Lớp {classId}</h1>
          <Button onClick={() => navigate(`/dashboard/teacher/class-students/${classId}`)}>
            Quay lại
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {students.map(student => (
            <Card key={student.user_id} className="p-4 shadow rounded-lg">
              <h2 className="text-xl font-semibold mb-4">
                {student.user_id} - {student.full_name}
              </h2>

              {gradeGroups.map(group => (
                <div key={group.label} className="mb-4">
                  <h3 className="font-semibold mb-2">{group.label}</h3>
                  {group.fields.map(f => (
                    <div key={f.scoreKey} className="mb-2">
                      {f.label && (
                        <span className="text-sm text-gray-500 mb-1 block">{f.label}</span>
                      )}
                      <div className="flex items-center w-full">
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          placeholder="0-100"
                          value={grades[student.user_id]?.[f.scoreKey] || ''}
                          onChange={e =>
                            handleGradeChange(student.user_id, f.scoreKey, e.target.value)
                          }
                          className="w-20 text-center"
                          noWrapper
                        />
                        <Input
                          placeholder="Nhận xét"
                          value={grades[student.user_id]?.[f.remarkKey] || ''}
                          onChange={e =>
                            handleGradeChange(student.user_id, f.remarkKey, e.target.value)
                          }
                          className="flex-grow ml-2"
                          noWrapper
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ))}

              <div className="mt-4 flex justify-between items-center">
                <span className="font-bold">
                  Tổng trung bình: {calculateAverage(student.user_id)}
                </span>
                <Button onClick={() => handleSaveGrade(student.user_id)}>Lưu điểm</Button>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default TeacherEnterGrades;
