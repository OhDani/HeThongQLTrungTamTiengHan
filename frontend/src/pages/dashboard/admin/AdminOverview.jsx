import React, { useEffect, useState } from "react";
import Card from "../../../components/common/Card";
import Table from "../../../components/common/Table";
import { userApi, courseApi, classApi, enrollmentApi } from "../../../services/api";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { FaUsers, FaBook, FaChalkboardTeacher, FaBookOpen } from "react-icons/fa";

const AdminOverview = () => {
    const [stats, setStats] = useState({});
    const [courses, setCourses] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const [users, coursesRes, classes, enrollments] = await Promise.all([
                    userApi.getAll(),
                    courseApi.getAll(),
                    classApi.getAll(),
                    enrollmentApi.getAll(),
                ]);

                const students = users.filter((u) => u.role === "Học viên").length;
                const teachers = users.filter((u) => u.role === "Giảng viên").length;

                setStats({
                    students,
                    teachers,
                    classes: classes.length,
                    courses: coursesRes.length,
                });

                const classCourseMap = Object.fromEntries(
                    classes.map((c) => [c.class_id, c.course_id])
                );

                const counts = {};
                enrollments
                    .filter((e) => e.status === "Đang học")
                    .forEach((e) => {
                        const cid = classCourseMap[e.class_id];
                        if (cid) counts[cid] = (counts[cid] || 0) + 1;
                    });

                setChartData(
                    coursesRes.map((c) => ({
                        name: c.course_name,
                        students: counts[c.course_id] || 0,
                    }))
                );

                setCourses(
                    coursesRes.map((c) => ({
                        ...c,
                        studentCount: counts[c.course_id] || 0,
                    }))
                );
            } catch (err) {
                console.error("Fetch data error:", err);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const courseColumns = [
        { key: "course_id", label: "ID" },
        { key: "course_name", label: "Tên khóa học" },
        { key: "studentCount", label: "Số học viên" },
        { key: "tuition_fee", label: "Học phí", render: (v) => v?.toLocaleString("vi-VN") },
        { key: "status", label: "Trạng thái" },
    ];

    if (loading) return <div className="p-6 text-center">Đang tải dữ liệu...</div>;

    return (
        <div>

            <div>
                <h1 className="text-2xl font-bold">Quản trị hệ thống</h1>
                <p className="text-gray-600">
                    Hôm nay, {new Date().toLocaleDateString("vi-VN")}
                </p>
                <p className="text-gray-600 ">
                    Chúc bạn 1 ngày tốt lành!
                </p>
            </div>
            <div className="p-6 space-y-6 bg-blue-100 rounded-lg shadow-md">
              
                <h2 className="text-1xl font-bold">| Thông tin chung</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ">
                    <Card className="flex flex-col items-center justify-center text-center p-6 space-y-3 bg-white rounded-lg shadow-md">
                        <FaUsers className="text-yellow-400 w-10 h-10" />
                        <p className="text-lg font-medium">Học Viên</p>
                        <p className="text-3xl font-bold">{stats.students || 450}</p>
                    </Card>
                    <Card className="flex flex-col items-center justify-center text-center p-6 space-y-3 bg-white rounded-lg shadow-md">
                        <FaBook className="text-purple-600 w-10 h-10" />
                        <p className="text-lg font-medium">Lớp Học</p>
                        <p className="text-3xl font-bold">{stats.classes || 12}</p>
                    </Card>
                    <Card className="flex flex-col items-center justify-center text-center p-6 space-y-3 bg-white rounded-lg shadow-md">
                        <FaChalkboardTeacher className="text-red-500 w-10 h-10" />
                        <p className="text-lg font-medium">Giảng Viên</p>
                        <p className="text-3xl font-bold">{stats.teachers || 10}</p>
                    </Card>
                    <Card className="flex flex-col items-center justify-center text-center p-6 space-y-3 bg-white rounded-lg shadow-md">
                        <FaBookOpen className="text-green-500 w-10 h-10" />
                        <p className="text-lg font-medium">Khóa Học</p>
                        <p className="text-3xl font-bold">{stats.courses || 3}</p>
                    </Card>
                </div>

                <h2 className="text-1xl font-bold">| Thống kê</h2>
                <div className="p-6 bg-white rounded-xl shadow ">
                    <h2 className="font-semibold mb-4 text-center">BIỂU ĐỒ HỌC VIÊN THEO KHOÁ</h2>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" angle={-25} textAnchor="end" height={80} />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="students" fill="#3b82f6" barSize={60} radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="p-6 bg-white rounded-xl shadow">
                    <h2 className="font-semibold mb-4">Danh sách khóa học</h2>
                    <Table columns={courseColumns} data={courses} />
                </div>
            </div>

        </div>
    );
};

export default AdminOverview;
