import React, { useEffect, useState } from "react";
import TeacherAssignment from "./TeacherAssignment"; // import form
import Card from "../../../components/common/Card";
import Table from "../../../components/common/Table";
import { assignmentApi } from "../../../services/api";

const TeacherAssignmentPage = () => {
  const [assignments, setAssignments] = useState([]);

  const fetchAssignments = async () => {
    const res = await assignmentApi.getAll();
    setAssignments(res);
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Quản lý bài tập</h1>

      <TeacherAssignment onSuccess={fetchAssignments} />

      {/* Danh sách bài tập */}
      <Card className="mt-6 p-4 shadow rounded bg-white">
        <h2 className="text-xl font-semibold mb-4">Danh sách bài tập</h2>
        <Table
          columns={[
            { key: "id", label: "ID" },
            { key: "title", label: "Tiêu đề" },
            { key: "description", label: "Mô tả" },
            { key: "due_date", label: "Hạn nộp" },
          ]}
          data={assignments}
        />
      </Card>
    </div>
  );
};

export default TeacherAssignmentPage;
