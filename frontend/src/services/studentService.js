import { classApi, enrollmentApi, userApi, gradeApi } from "./api";

// Lấy tất cả enrollment của 1 học viên
export const getStudentEnrollments = async (studentId) => {
  const enrollments = await enrollmentApi.getAll();
  return enrollments.filter((en) => Number(en.student_id) === Number(studentId));
};

// Lấy danh sách lớp học đã đăng ký của học viên
export const getStudentClasses = async (studentId) => {
  const myEnrollments = await getStudentEnrollments(studentId);
  if (!myEnrollments.length) return [];

  const classes = await classApi.getAll();
  const teachers = await userApi.getAll();

  return classes
    .filter((cls) =>
      myEnrollments.some((en) => Number(en.class_id) === Number(cls.class_id))
    )
    .map((cls) => {
      const teacher = teachers.find((t) => Number(t.user_id) === Number(cls.teacher_id));
      const [days, time] = cls.schedule.split(",").map((s) => s.trim());
      return {
        class_id: cls.class_id,
        class_name: cls.class_name,
        days: days || "",
        time: time || "",
        teacher_name: teacher?.full_name || "Chưa có",
        room: cls.room,
      };
    });
};

// Lấy tất cả điểm của học viên
export const getStudentGrades = async (studentId) => {
  const allGrades = await gradeApi.getAll();
  return allGrades.filter((g) => g.student_id === studentId);
};

// Lấy điểm mới nhất của học viên
export const getLatestStudentGrade = async (studentId) => {
  const grades = await getStudentGrades(studentId);
  if (!grades.length) return null;
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
