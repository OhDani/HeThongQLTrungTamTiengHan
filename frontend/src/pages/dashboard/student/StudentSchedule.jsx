import React, { useEffect, useState } from "react";
import Card from "../../../components/common/Card";
import Table from "../../../components/common/Table";
import { getStudentClasses } from "../../../services/studentService";

const StudentSchedulePage = ({ studentId = 1 }) => {
  const [schedule, setSchedule] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const myClasses = await getStudentClasses(studentId);
        setSchedule(myClasses);
      } catch (err) {
        console.error("Lỗi fetch lịch học:", err);
        setError("Không thể tải lịch học. Vui lòng thử lại sau.");
      }
    };

    fetchSchedule();
  }, [studentId]);

  const columns = [
    { key: "class_name", label: "Lớp học" },
    { key: "time", label: "Thời gian" },
    { key: "days", label: "Ngày" },
    { key: "teacher_name", label: "Giảng viên" },
    { key: "room", label: "Phòng" },
  ];

  return (
    <Card className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Lịch học của tôi
      </h1>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {!error && schedule.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-lg text-gray-700">Bạn chưa có lịch học nào.</p>
          <p className="text-sm text-gray-500 mt-2">
            Hãy đăng ký khóa học để xem lịch học của bạn.
          </p>
        </div>
      ) : (
        <Table columns={columns} data={schedule} />
      )}
    </Card>
  );
};

export default StudentSchedulePage;
