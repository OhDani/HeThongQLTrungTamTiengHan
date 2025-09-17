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
    const [classes, setClasses] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const [users, courses, classesRes, enrollments] = await Promise.all([
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
                    classes: classesRes.length,
                    courses: courses.length,
                });

                const classCourseMap = Object.fromEntries(
                    classesRes.map((c) => [c.class_id, c.course_id])
                );

                const counts = {};
                enrollments
                    .filter((e) => e.status === "Đang học")
                    .forEach((e) => {
                        const cid = classCourseMap[e.class_id];
                        if (cid) counts[cid] = (counts[cid] || 0) + 1;
                    });

                setChartData(
                    courses.map((c) => ({
                        name: c.course_name,
                        students: counts[c.course_id] || 0,
                    }))
                );

                setClasses(
                    classesRes.map((cls) => ({
                        ...cls,
                        course_name:
                            courses.find((c) => c.course_id === cls.course_id)?.course_name ||
                            "Không rõ",
                    }))
                );
            } catch (err) {
                console.error("Fetch data error:", err);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const classColumns = [
        { key: "class_name", label: "Tên lớp" },
        { key: "course_name", label: "Khóa học" },
        { key: "schedule", label: "Lịch học" },
        { key: "room", label: "Phòng" },
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
                <p className="text-gray-600">Chúc bạn 1 ngày tốt lành!</p>
            </div>

            <div className="p-6 space-y-6 bg-blue-100 rounded-lg shadow-md">

                <h2 className="text-1xl font-bold">| Thông tin chung</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ">
                    <Card className="flex flex-col items-center justify-center text-center p-6 space-y-3 bg-white rounded-lg shadow-md">
                        <FaUsers className="text-yellow-400 w-10 h-10" />
                        <p className="text-lg font-medium">Học Viên</p>
                        <p className="text-3xl font-bold">{stats.students || 0}</p>
                    </Card>
                    <Card className="flex flex-col items-center justify-center text-center p-6 space-y-3 bg-white rounded-lg shadow-md">
                        <FaBook className="text-purple-600 w-10 h-10" />
                        <p className="text-lg font-medium">Lớp Học</p>
                        <p className="text-3xl font-bold">{stats.classes || 0}</p>
                    </Card>
                    <Card className="flex flex-col items-center justify-center text-center p-6 space-y-3 bg-white rounded-lg shadow-md">
                        <FaChalkboardTeacher className="text-red-500 w-10 h-10" />
                        <p className="text-lg font-medium">Giảng Viên</p>
                        <p className="text-3xl font-bold">{stats.teachers || 0}</p>
                    </Card>
                    <Card className="flex flex-col items-center justify-center text-center p-6 space-y-3 bg-white rounded-lg shadow-md">
                        <FaBookOpen className="text-green-500 w-10 h-10" />
                        <p className="text-lg font-medium">Khóa Học</p>
                        <p className="text-3xl font-bold">{stats.courses || 0}</p>
                    </Card>
                </div>

                <h2 className="text-1xl font-bold">| Thống kê</h2>
                <div className="p-6 bg-white rounded-xl shadow ">
                    <h2 className="font-semibold mb-4 text-center">
                        BIỂU ĐỒ HỌC VIÊN THEO KHOÁ
                    </h2>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" angle={-25} textAnchor="end" height={80} />
                            <YAxis />
                            <Tooltip />
                            <Bar
                                dataKey="students"
                                fill="#3b82f6"
                                barSize={60}
                                radius={[6, 6, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <h2 className="text-1xl font-bold">| Thời khoá biểu</h2>
                <div className="p-6 bg-white rounded-xl shadow">
                    <Table columns={classColumns} data={classes} />
                </div>
            </div>
        </div>
    );
};

export default AdminOverview;
