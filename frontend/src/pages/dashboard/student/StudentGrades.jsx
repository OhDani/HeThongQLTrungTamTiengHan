import React, { useEffect, useState } from "react";
import Card from "../../../components/common/Card";
import Table from "../../../components/common/Table";
import {
  getStudentGradesOverview,
  getStudentGradesTable,
} from "../../../services/studentService";

const StudentGradesPage = ({ studentId = 1 }) => {
  const [overview, setOverview] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const [ov, table] = await Promise.all([
          getStudentGradesOverview(studentId),
          getStudentGradesTable(studentId),
        ]);
        setOverview(ov);
        setTableData(table);
      } catch (err) {
        console.error(err);
        setError("Không thể tải điểm số. Vui lòng thử lại sau.");
      }
    };
    fetchGrades();
  }, [studentId]);

  const columns = [
    { key: "class_name", label: "Môn học" },
    { key: "test_type", label: "Loại bài kiểm tra" },
    { key: "score", label: "Điểm số" },
    { key: "remark", label: "Nhận xét" },
  ];

  return (
    <Card className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Điểm số của tôi</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {overview && (
        <div className="mb-6 grid grid-cols-3 gap-6 text-center">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-blue-700">Tổng số bài kiểm tra</div>
            <div className="text-2xl font-bold text-blue-900">{overview.totalTests}</div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-green-700">Điểm trung bình (%)</div>
            <div className="text-2xl font-bold text-green-900">{overview.avgScore}</div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="text-purple-700">Bài kiểm tra gần nhất</div>
            <div className="text-2xl font-bold text-purple-900">
              {overview.latestTestDate
                ? new Date(overview.latestTestDate).toLocaleDateString()
                : "-"}
            </div>
          </div>
        </div>
      )}

      <Table columns={columns} data={tableData} />
    </Card>
  );
};

export default StudentGradesPage;
