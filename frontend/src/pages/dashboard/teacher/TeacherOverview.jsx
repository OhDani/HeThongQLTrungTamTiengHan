import React, { useState, useEffect } from 'react';
import Card from '../../../components/common/Card';
import Alert from '../../../components/common/Alert';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import { BookOpen, Bell, CalendarDays, Users, UserCheck, UserCheck2 } from "lucide-react";
import { userApi, classApi, courseApi, enrollmentApi, notificationApi } from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';

const TeacherOverview = () => {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) {
            setError("Vui lòng đăng nhập để xem dữ liệu.");
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                const [
                    usersResponse,
                    classesResponse,
                    coursesResponse,
                    enrollmentsResponse,
                    notificationsResponse,
                ] = await Promise.all([
                    userApi.getAll(),
                    classApi.getAll(),
                    courseApi.getAll(),
                    enrollmentApi.getAll(),
                    notificationApi.getAll(),
                ]);

                setEnrollments(enrollmentsResponse);

                // Lọc các khóa học do giáo viên đang đăng nhập giảng dạy
                const teacherCourses = classesResponse
                    .filter((cls) => cls.user_id === user.user_id)
                    .map((cls) => {
                        const course = coursesResponse.find((c) => c.course_id === cls.course_id);
                        return { ...course, ...cls };
                    });

                // Lấy danh sách học viên từ lớp của giáo viên
                const enrolledStudents = enrollmentsResponse
                    .filter((enroll) =>
                        teacherCourses.some((tc) => tc.class_id === enroll.class_id)
                    )
                    .map((enroll) =>
                        usersResponse.find((u) => u.user_id === enroll.user_id)
                    )
                    .filter(Boolean);

                const teacherNotifications = notificationsResponse.filter(
                    (notif) =>
                        notif.receiver_role === "Giảng viên" ||
                        notif.sender_id === user.user_id
                );

                setCourses(teacherCourses);
                setStudents(enrolledStudents);
                setNotifications(teacherNotifications);
                setLoading(false);
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu:", error);
                setError("Không thể tải dữ liệu. Vui lòng kiểm tra kết nối hoặc thử lại sau.");
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    if (loading) return <LoadingSpinner />;
    if (error) return <Alert message={error} type="error" />;

    const currentTeacher = user || { full_name: "Giáo viên" };

    // Số lớp đang dạy
    const activeClasses = courses.filter(
        (course) => course.status === "Đang mở"
    ).length;

    // Lịch dạy hôm nay
    const today = new Date().toLocaleDateString("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh",
    }).split('/')[0];
    const todaySchedule = courses
        .filter((course) => course.schedule.includes(today))
        .map((course) => `${course.class_name}: ${course.schedule}`);

    // Số thông báo
    const newNotificationsCount = notifications.length;

    // Lịch sắp tới
    const upcomingSchedule = courses
        .filter((course) => new Date(course.start_date) > new Date())
        .sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
        .slice(0, 1)
        .map((course) => `${course.class_name}: ${course.start_date} - ${course.schedule}`);

    // Thống kê học viên
    const totalStudents = students.length;
    const activeStudents = students.filter((student) =>
        enrollments.some(
            (en) => en.user_id === student.user_id && en.status === "Đang học"
        )
    ).length;
    const completedStudents = students.filter((student) =>
        enrollments.some(
            (en) => en.user_id === student.user_id && en.status === "Hoàn thành"
        )
    ).length;

    return (
        <div className="flex h-screen" style={{ backgroundColor: "#F7FAFC" }}>
            <div className="flex-1 flex flex-col overflow-hidden">
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold mb-2">GIẢNG VIÊN</h1>
                        <h2 className="text-sm text-gray-600 mb-2">
                            Hôm nay, ngày{" "}
                            {new Date().toLocaleString("vi-VN", {
                                timeZone: "Asia/Ho_Chi_Minh",
                            })}
                        </h2>
                        <h3 className="text-sm italic">
                            Chào mừng {currentTeacher.full_name}, chúc bạn một ngày giảng dạy hiệu quả và đầy cảm hứng
                        </h3>
                    </div>

                    {/* 3 Card ngang */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
                        <Card className="p-4 flex flex-col bg-white shadow rounded-lg">
                            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                                <BookOpen size={20} className="text-blue-600" />
                                Chào mừng {currentTeacher.full_name}
                            </h3>
                            <p>
                                Số lớp đang dạy:{" "}
                                <span className="text-blue-600 font-bold">{activeClasses}</span>
                            </p>
                            <p>
                                Lịch dạy hôm nay:{" "}
                                {todaySchedule.length ? (
                                    <span className="text-green-600 font-medium">{todaySchedule.join(", ")}</span>
                                ) : (
                                    <span className="text-gray-400 italic">Không có</span>
                                )}
                            </p>
                        </Card>

                        <Card className="p-4 flex flex-col bg-white shadow rounded-lg">
                            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                                <Bell size={20} className="text-red-500" /> Thông báo mới
                            </h3>
                            <p>
                                Số lượng:{" "}
                                <span className="text-red-500 font-bold">{newNotificationsCount}</span>
                            </p>
                        </Card>

                        <Card className="p-4 flex flex-col bg-white shadow rounded-lg">
                            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                                <CalendarDays size={20} className="text-yellow-500" /> Lịch dạy sắp tới
                            </h3>
                            <p>
                                {upcomingSchedule.length ? (
                                    <span className="text-yellow-600 font-medium">{upcomingSchedule[0]}</span>
                                ) : (
                                    <span className="text-gray-400 italic">Không có</span>
                                )}
                            </p>
                        </Card>
                    </div>

                    {/* Card lớn thống kê */}
                    <Card
                        className="mb-6 p-4 rounded-lg shadow"
                        style={{ backgroundColor: "#E3EDF9" }}
                    >
                        <h2 className="text-xl font-semibold mb-4">| Thông tin chung</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                            <Card className="p-3 text-center flex flex-col items-center bg-white shadow rounded-lg">
                                <Users size={20} className="mb-2 text-blue-600" />
                                <p className="font-semibold">Tổng học viên</p>
                                <p>{totalStudents}</p>
                            </Card>
                            <Card className="p-3 text-center flex flex-col items-center bg-white shadow rounded-lg">
                                <UserCheck size={20} className="mb-2 text-green-600" />
                                <p className="font-semibold">Học viên đang học</p>
                                <p>{activeStudents}</p>
                            </Card>
                            <Card className="p-3 text-center flex flex-col items-center bg-white shadow rounded-lg">
                                <UserCheck2 size={20} className="mb-2 text-purple-600" />
                                <p className="font-semibold">Học viên đã xong</p>
                                <p>{completedStudents}</p>
                            </Card>
                        </div>

                        <h3 className="text-xl font-semibold mb-4">| Thống kê</h3>
                        <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg">
                            <p>Biểu đồ học viên theo lớp (Tích hợp Chart.js / Recharts)</p>
                        </div>
                    </Card>
                </main>
            </div>
        </div>
    );
};

export default TeacherOverview;
