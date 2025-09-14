import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Card from "../../../components/common/Card";
import Table from "../../../components/common/Table";
import Select from "../../../components/common/Select";
import Button from "../../../components/common/Button";
import Alert from "../../../components/common/Alert";
import Modal from "../../../components/common/Modal";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import { userApi, enrollmentApi, attendanceApi } from "../../../services/api";

const TeacherAttendanceDetail = () => {
    const { classId } = useParams();
    const [students, setStudents] = useState([]);
    const [attendanceDates, setAttendanceDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [expandedStudentId, setExpandedStudentId] = useState(null);
    const [editStatus, setEditStatus] = useState({});
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("success");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [usersResponse, enrollmentsResponse, attendanceResponse] = await Promise.all([
                    userApi.getAll(),
                    enrollmentApi.getAll(),
                    attendanceApi.getAll(),
                ]);

                const classEnrollments = enrollmentsResponse.filter(
                    (en) => en.class_id === parseInt(classId)
                );

                const classStudents = classEnrollments
                    .map((en) => usersResponse.find((u) => u.user_id === en.student_id))
                    .filter(Boolean);

                setStudents(classStudents);

                const dates = [
                    ...new Set(
                        attendanceResponse
                            .filter((a) => a.class_id === parseInt(classId))
                            .map((a) => a.date)
                    ),
                ].sort();
                setAttendanceDates(dates);
                setSelectedDate(dates[0] || "");

                setAttendanceData(attendanceResponse);
            } catch (err) {
                console.error(err);
                setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [classId]);

    useEffect(() => {
        const initialStatus = {};
        students.forEach((student) => {
            const att = attendanceData.find(
                (a) => a.student_id === student.user_id && a.date === selectedDate
            );
            initialStatus[student.user_id] = att ? att.status : "Vắng";
        });
        setEditStatus(initialStatus);
    }, [selectedDate, students, attendanceData]);

    const handleStatusChange = (studentId, value) => {
        setEditStatus((prev) => ({ ...prev, [studentId]: value }));
    };

    const handleSaveAll = async () => {
        try {
            setLoading(true);

            const updates = students.map((student) => {
                const current = attendanceData.find(
                    (a) => a.student_id === student.user_id && a.date === selectedDate
                );
                if (current) {
                    return attendanceApi.update(current.id, {
                        ...current,
                        status: editStatus[student.user_id],
                    });
                } else {
                    return attendanceApi.create({
                        student_id: student.user_id,
                        class_id: parseInt(classId),
                        date: selectedDate,
                        status: editStatus[student.user_id],
                    });
                }
            });

            await Promise.all(updates);

            const updatedAttendance = await attendanceApi.getAll();
            setAttendanceData(updatedAttendance);

            setAlertMessage("Cập nhật điểm danh thành công!");
            setAlertType("success");
        } catch (err) {
            console.error(err);
            setAlertMessage("Cập nhật thất bại!");
            setAlertType("error");
        } finally {
            setAlertVisible(true);
            setTimeout(() => setAlertVisible(false), 3000);
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <Alert message={error} type="error" />;

    const columns = [
        { key: "stt", label: "STT", render: (_, index) => index + 1 },
        { key: "user_id", label: "ID" },
        { key: "full_name", label: "Họ và tên" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Số điện thoại" },
        {
            key: "status",
            label: "Trạng thái",
            render: (student) => (
                <Select
                    value={editStatus[student.user_id] || "Vắng"}
                    onChange={(e) => handleStatusChange(student.user_id, e.target.value)}
                    options={[
                        { value: "Có mặt", label: "Có mặt" },
                        { value: "Đi trễ", label: "Đi trễ" },
                        { value: "Vắng phép", label: "Vắng phép" },
                        { value: "Vắng", label: "Vắng" },
                    ]}
                    className="w-full mt-4"
                />
            ),
        },
        {
            key: "view",
            label: "",
            render: (student) => (
                <Button className="w-full" onClick={() => setExpandedStudentId(student.user_id)}>
                    Xem
                </Button>
            ),
        },
    ];

    return (
        <div className="flex h-screen" style={{ backgroundColor: "#F7FAFC" }}>
            <div className="flex-1 flex flex-col overflow-hidden">
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4">
                    <h1 className="text-3xl font-bold mb-4">Chi tiết điểm danh lớp {classId}</h1>

                    <div className="mb-4 w-64">
                        <Select
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            options={[
                                { value: "", label: "Chọn ngày" },
                                ...attendanceDates.map((d) => ({ value: d, label: d })),
                            ]}
                            className="p-2 border rounded w-full"
                        />
                    </div>

                    <Card className="p-4 shadow rounded-lg">
                        <Table
                            columns={columns}
                            data={students}
                            rowClassName={(index) =>
                                index % 2 === 0 ? "bg-gray-100" : "bg-white"
                            }
                        />

                        <div className="mt-4 text-right">
                            <Button type="button" variant="primary" onClick={handleSaveAll}>
                                Lưu tất cả
                            </Button>
                        </div>
                    </Card>

                    {alertVisible && (
                        <div className="fixed top-4 right-4 z-50">
                            <Alert message={alertMessage} type={alertType} />
                        </div>
                    )}

                    {expandedStudentId && (
                        <Modal
                            isOpen={true}
                            onClose={() => setExpandedStudentId(null)}
                            title={
                                students.find((s) => s.user_id === expandedStudentId)?.full_name +
                                " - Điểm danh"
                            }
                            noOverlay={true}
                        >
                            <Table
                                columns={[
                                    { key: "date", label: "Ngày" },
                                    { key: "status", label: "Trạng thái" },
                                ]}
                                data={attendanceData
                                    .filter((a) => a.student_id === expandedStudentId)
                                    .sort((a, b) => a.date.localeCompare(b.date))}
                            />
                            <div className="mt-4 text-right">
                                <Button
                                    className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                                    onClick={() => setExpandedStudentId(null)}
                                >
                                    Đóng
                                </Button>
                            </div>
                        </Modal>
                    )}
                </main>
            </div>
        </div>
    );
};

export default TeacherAttendanceDetail;
