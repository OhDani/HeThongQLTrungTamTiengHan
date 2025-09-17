import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../../../components/common/Table';
import Alert from '../../../components/common/Alert';
import Button from '../../../components/common/Button';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import { userApi, classApi, courseApi, enrollmentApi } from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';
import { useSearch } from "../../../contexts/SearchContext";

const TeacherClassList = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { searchTerm } = useSearch();

  // Fetch dữ liệu ban đầu
  useEffect(() => {
    if (!user) {
      setError("Vui lòng đăng nhập để xem dữ liệu.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [users, classes, courses, enrollments] = await Promise.all([
          userApi.getAll(),
          classApi.getAll(),
          courseApi.getAll(),
          enrollmentApi.getAll(),
        ]);

        const teacherCourses = classes
          .filter((cls) => cls.user_id === user.user_id)
          .map((cls) => {
            const course = courses.find((c) => c.course_id === cls.course_id);
            const studentCount = enrollments.filter(en => en.class_id === cls.class_id).length;
            return {
              ...course,
              ...cls,
              teacherName: users.find((u) => u.user_id === cls.user_id)?.full_name || "Unknown",
              studentCount,
            };
          });

        setCourses(teacherCourses);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        setError("Không thể tải dữ liệu. Vui lòng kiểm tra kết nối hoặc thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Search theo searchTerm
  const [filteredCourses, setFilteredCourses] = useState([]);
  useEffect(() => {
    if (searchTerm) {
      const filtered = courses.filter(cls =>
        cls.class_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.course_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCourses(filtered);
    } else {
      setFilteredCourses(courses);
    }
  }, [searchTerm, courses]);

  if (loading) return <LoadingSpinner />;
  if (error) return <Alert message={error} type="error" />;

  const columns = [
    { key: 'stt', label: 'Số thứ tự', render: (item, index) => <div className="text-center">{index + 1}</div> },
    { key: 'class_id', label: 'ID lớp', render: (item) => <div className="text-center">{item.class_id}</div> },
    { key: 'class_name', label: 'Tên lớp', render: (item) => <div className="text-center">{item.class_name}</div> },
    { key: 'course_name', label: 'Khóa học', render: (item) => <div className="text-center">{item.course_name}</div> },
    { key: 'schedule', label: 'Lịch học', render: (item) => <div className="text-center">{item.schedule}</div> },
    { key: 'room', label: 'Phòng', render: (item) => <div className="text-center">{item.room}</div> },
    { key: 'studentCount', label: 'Số lượng học viên', render: (item) => <div className="text-center text-blue-600 font-semibold">{item.studentCount}</div> },
    { key: 'action', label: 'Hành động', render: (item) => (
      <div className="flex justify-center gap-2">
        <Button onClick={() => navigate(`/dashboard/teacher/class-students/${item.class_id}`)}>Xem học viên</Button>
        <Button onClick={() => navigate(`/dashboard/teacher/attendance/${item.class_id}`)}>Xem điểm danh</Button>
      </div>
    )}
  ];

  return (
    <div className="flex h-screen bg-blue-50">
      <main className="flex-1 overflow-x-hidden overflow-y-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Danh sách lớp học</h1>
        <Table
          columns={columns}
          data={filteredCourses}
          rowClassName={(index) => (index % 2 === 0 ? 'bg-gray-100' : 'bg-white')}
        />
      </main>
    </div>
  );
};

export default TeacherClassList;
