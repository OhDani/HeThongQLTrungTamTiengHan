import { gradeApi, userApi } from "./api";

// Lấy tất cả điểm của học viên
export const getStudentGrades = async (studentId) => {
  const allGrades = await gradeApi.getAll();
  return allGrades.filter((g) => g.student_id === studentId);
};

// Lấy điểm mới nhất của học viên
export const getLatestStudentGrade = async (studentId) => {
  const grades = await getStudentGrades(studentId);
  if (grades.length === 0) return null;
  return grades.reduce((latest, current) =>
    current.grade_id > latest.grade_id ? current : latest
  );
};

// Lấy thông tin user theo studentId
export const getStudentInfo = async (studentId) => {
  const users = await userApi.getAll();
  return users.find((u) => u.user_id === studentId) || null;
};

// Lấy cả info + latest grade
export const getStudentOverview = async (studentId) => {
  const [studentInfo, latestGrade] = await Promise.all([
    getStudentInfo(studentId),
    getLatestStudentGrade(studentId),
  ]);

  return { studentInfo, latestGrade };
};
