import React, { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import Card from "../../../components/common/Card";
import Table from "../../../components/common/Table";
import Timetable from "../../../components/common/Timetable";
import thth from "../../../assets/img/thth.png";

// API
import { classApi, courseApi } from "../../../services/api";

const TeacherSchedulePage = () => {
    const { user } = useAuth();
    const [classes, setClasses] = useState([]);
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const cls = await classApi.getAll();
            const crs = await courseApi.getAll();
            setClasses(cls.filter((c) => String(c.user_id) === String(user?.user_id)));
            setCourses(crs);
        };
        if (user) fetchData();
    }, [user]);

    const courseMap = Object.fromEntries(courses.map((c) => [c.course_id, c]));

    // ====== LỊCH HÔM NAY ======
    const today = new Date();
    const weekday = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"][today.getDay()];
    const todayClasses = classes.filter((cls) => cls.schedule.includes(weekday));

    return (
        <div className="flex-1 w-full p-6 bg-blue-50 min-h-screen space-y-8 overflow-y-auto">
            {/* LỊCH DẠY HÔM NAY */}
            <Card className="p-6 shadow rounded bg-white">
                <h2 className="text-lg font-semibold mb-4">| Lịch dạy hôm nay</h2>
                {todayClasses.length === 0 ? (
                    <p className="italic text-gray-600">Hôm nay không có lớp nào.</p>
                ) : (
                    <Table
                        columns={[
                            { key: "stt", label: "STT", render: (_, idx) => idx + 1 },
                            { key: "class_name", label: "Lớp" },
                            {
                                key: "course_name",
                                label: "Khóa học",
                                render: (row) => courseMap[row.course_id]?.course_name,
                            },
                            { key: "room", label: "Phòng" },
                            {
                                key: "schedule",
                                label: "Giờ học",
                                render: (row) => row.schedule.split(",")[1]?.trim(),
                            },
                        ]}
                        data={todayClasses}
                    />
                )}
            </Card>

            {/* THỜI KHÓA BIỂU TUẦN */}
            <Timetable classes={classes} courseMap={courseMap} />

            {/* TẤT CẢ LỚP HỌC */}
            <h2 className="text-lg font-semibold mb-4">| Tất cả lớp học</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {classes.map((cls) => {
                    const course = courseMap[cls.course_id];
                    return (
                        <Card
                            key={cls.class_id}
                            className="shadow rounded-lg hover:shadow-lg transition bg-white overflow-hidden"
                        >
                            {/* Ảnh cover tràn khung trên đầu */}
                            <div className="w-full h-40">
                                <img
                                    src={thth}
                                    alt="course cover"
                                    className="w-full h-40 object-cover"
                                />
                            </div>

                            <div className="p-3 text-center space-y-1">
                                <h3 className="text-base font-bold">{course?.course_name}</h3>
                                <p className="text-sm text-gray-700">{cls.class_name}</p>
                                <p className="text-xs text-gray-500">
                                    {course?.start_date} - {course?.end_date}
                                </p>
                                <p className="text-xs">Phòng: {cls.room}</p>
                                <p className="text-xs">
                                    Số lượng: {cls.size}/{cls.sizemax}
                                </p>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

export default TeacherSchedulePage;
