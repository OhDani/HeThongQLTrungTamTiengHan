import React, { useState, useEffect } from 'react';
import Card from '../../../components/common/Card';
import Table from '../../../components/common/Table';
import Button from '../../../components/common/Button';
import Alert from '../../../components/common/Alert';
import Select from '../../../components/common/Select';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import Input from '../../../components/common/Input';
import { userApi, classApi, enrollmentApi, attendanceApi, courseApi } from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';

const TeacherAttendance = () => {
    const { user } = useAuth();
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // Lấy danh sách lớp
    useEffect(() => {
        if (!user) {
            setError("Vui lòng đăng nhập để xem dữ liệu.");
            setLoading(false);
            return;
        }

        const fetchClasses = async () => {
            try {
                setLoading(true);
                const [classesResponse, coursesResponse] = await Promise.all([
                    classApi.getAll(),
                    courseApi.getAll(),
                ]);

                const teacherClasses = classesResponse
                    .filter((cls) => cls.user_id === user.user_id)
                    .map((cls) => {
                        const course = coursesResponse.find((c) => c.course_id === cls.course_id);
                        return {
                            ...cls,
                            course_name: course ? course.course_name : 'Unknown',
                        };
                    });

                setClasses(teacherClasses);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError("Không thể tải danh sách lớp.");
                setLoading(false);
            }
        };

        fetchClasses();
    }, [user]);

    // Lấy danh sách học viên và điểm danh
    useEffect(() => {
        if (!selectedClass || !selectedDate) return;

        const fetchStudentsAndAttendance = async () => {
            try {
                setLoading(true);

                const [usersResponse, enrollmentsResponse, attendanceResponse] = await Promise.all([
                    userApi.getAll(),
                    enrollmentApi.getAll(),
                    attendanceApi.getAll(),
                ]);

                const classStudents = enrollmentsResponse
                    .filter((enroll) => enroll.class_id === parseInt(selectedClass))
                    .map((enroll) => {
                        const student = usersResponse.find(u => u.user_id === enroll.user_id);
                        return student ? { ...student, enrollment_id: enroll.enrollment_id } : null;
                    })
                    .filter(Boolean);

                const initialAttendance = classStudents.reduce((acc, student) => {
                    const att = attendanceResponse.find(a =>
                        a.user_id === student.user_id &&
                        a.class_id === parseInt(selectedClass) &&
                        a.date === selectedDate
                    );
                    acc[student.user_id] = att ? att.status : 'Vắng';
                    return acc;
                }, {});

                setStudents(classStudents);
                setAttendance(initialAttendance);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError("Không thể tải dữ liệu học viên và điểm danh.");
                setLoading(false);
            }
        };

        fetchStudentsAndAttendance();
    }, [selectedClass, selectedDate]);

    const handleAttendanceChange = (studentId, status) => {
        setAttendance(prev => ({ ...prev, [studentId]: status }));
    };

    const handleSaveAttendance = async () => {
        try {
            setLoading(true);
            setError(null);
            setSuccessMessage(null);

            const attendanceData = Object.entries(attendance).map(([studentId, status]) => ({
                class_id: parseInt(selectedClass),
                user_id: parseInt(studentId),
                date: selectedDate,
                status,
            }));

            await Promise.all(attendanceData.map(att => attendanceApi.create(att)));

            setSuccessMessage("Điểm danh đã được lưu thành công!");
            setTimeout(() => setSuccessMessage(null), 3000);

            const updatedAttendance = await attendanceApi.getAll();
            const newAttendanceState = students.reduce((acc, student) => {
                const att = updatedAttendance.find(a =>
                    a.user_id === student.user_id &&
                    a.class_id === parseInt(selectedClass) &&
                    a.date === selectedDate
                );
                acc[student.user_id] = att ? att.status : 'Vắng';
                return acc;
            }, {});
            setAttendance(newAttendanceState);

        } catch (err) {
            console.error(err);
            setError("Không thể lưu điểm danh.");
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { key: 'stt', label: 'STT', render: (_, index) => index + 1 },
        { key: 'user_id', label: 'ID' },
        { key: 'full_name', label: 'Họ và tên' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Số điện thoại' },
        {
            key: 'attendance',
            label: 'Điểm danh',
            render: (student) => (
                <Select
                    value={attendance[student.user_id] || 'Vắng'}
                    onChange={(e) => handleAttendanceChange(student.user_id, e.target.value)}
                    options={[
                        { value: 'Có mặt', label: 'Có mặt' },
                        { value: 'Đi trễ', label: 'Đi trễ' },
                        { value: 'Vắng phép', label: 'Vắng phép' },
                        { value: 'Vắng', label: 'Vắng' },
                    ]}
                    className="w-full p-1 border rounded"
                />
            )
        }
    ];

    return (
        <div className="flex h-screen bg-blue-50" >
            <div className="flex-1 flex flex-col overflow-hidden">
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4">
                    {(error || successMessage) && (
                        <div className="fixed top-4 right-4 z-50">
                            {error && <Alert message={error} type="error" />}
                            {successMessage && <Alert message={successMessage} type="success" />}
                        </div>
                    )}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold mb-2">Quản lý điểm danh</h1>
                        <div className="flex space-x-4">
                            <Select
                                value={selectedClass || ''}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                options={[
                                    { value: '', label: 'Chọn lớp' },
                                    ...classes.map(cls => ({
                                        value: cls.class_id,
                                        label: `${cls.class_name} - ${cls.course_name}`
                                    }))
                                ]}
                                className="p-2 border rounded w-64"
                            />
                            <Input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="p-2 border rounded"
                            />
                        </div>
                    </div>

                    {selectedClass && selectedDate && (
                        <Card className="p-4 shadow rounded-lg">
                            <Table
                                columns={columns}
                                data={students}
                                rowClassName={(index) => (index % 2 === 0 ? 'bg-gray-100' : 'bg-white')}
                            />
                            <Button onClick={handleSaveAttendance} disabled={loading}>
                                Lưu điểm danh
                            </Button>
                        </Card>
                    )}

                    {loading && <LoadingSpinner />}
                </main>
            </div>
        </div>
    );
};

export default TeacherAttendance;
