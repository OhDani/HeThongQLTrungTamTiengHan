import {
  classApi,
  enrollmentApi,
  userApi,
  gradeApi,
  submissionApi,
  assignmentApi,
  flashcardApi,
  feedbackApi,
  courseApi,
} from "./api";

/** ===============================
 * LỚP HỌC + TÀI LIỆU
 * =============================== */

// Lấy tất cả enrollment của 1 học viên
export const getStudentEnrollments = async (studentId) => {
  const enrollments = await enrollmentApi.getAll();
  return Array.isArray(enrollments)
    ? enrollments.filter((en) => Number(en.user_id) === Number(studentId))
    : [];
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
      const teacher = teachers.find(
        (t) => Number(t.user_id) === Number(cls.user_id)
      );
      const [days, time] = (cls.schedule || "").split(",").map((s) => s.trim());
      return {
        class_id: cls.class_id,
        class_name: cls.class_name,
        days: days || "",
        time: time || "",
        teacher_name: teacher?.full_name || "Chưa có",
        room: cls.room || "",
      };
    });
};

// Lấy tất cả assignments của học viên, kèm flashcards
export const getStudentAssignments = async (studentId) => {
  const allAssignments = await assignmentApi.getAll();
  const allFlashcards = await flashcardApi.getAll();

  if (!Array.isArray(allAssignments)) return [];

  return allAssignments
    .filter((a) => Number(a.user_id) === Number(studentId))
    .map((a) => {
      const flashcards =
        a.category?.toLowerCase() === "từ vựng" && a.material_id
          ? allFlashcards.filter(
              (f) => Number(f.material_id) === Number(a.material_id)
            )
          : [];

      return {
        ...a,
        word_count: flashcards.length, 
        flashcards,
      };
    });
};

/** ===============================
 * ĐIỂM SỐ
 * =============================== */

// Lấy tất cả điểm của học viên
export const getStudentGrades = async (studentId) => {
  const allGrades = await gradeApi.getAll();
  return allGrades.filter((g) => Number(g.user_id) === Number(studentId));
};

// Lấy điểm mới nhất của học viên
export const getLatestStudentGrade = async (studentId) => {
  const grades = await getStudentGrades(studentId);
  if (!grades.length) return null;
  return grades.reduce((latest, current) =>
    current.grade_id > latest.grade_id ? current : latest
  );
};

// Lấy ngày bài kiểm tra gần nhất dựa trên submissions
export const getLatestStudentGradeDate = async (studentId) => {
  const submissions = await submissionApi.getAll();
  const studentSubmissions = submissions
    .filter((s) => Number(s.user_id) === Number(studentId) && s.submitted_at)
    .sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at));

  return studentSubmissions.length ? studentSubmissions[0].submitted_at : null;
};

// Tổng quan điểm số: tổng bài kiểm tra, điểm trung bình, ngày bài kiểm tra gần nhất
export const getStudentGradesOverview = async (studentId) => {
  const grades = await getStudentGrades(studentId);

  if (!grades.length)
    return { totalTests: 0, avgScore: 0, latestTestDate: null };

  // Liệt kê tất cả loại bài kiểm tra
  const testsPerGrade = [
    "attendance_score",
    "assignment_score",
    "midterm_listening",
    "midterm_speaking",
    "midterm_reading",
    "midterm_writing",
    "final_listening",
    "final_speaking",
    "final_reading",
    "final_writing",
  ];

  // Tính tổng số bài kiểm tra
  const totalTests = grades.reduce(
    (sum, g) =>
      sum +
      testsPerGrade.filter((key) => g[key] !== null && g[key] !== undefined)
        .length,
    0
  );

  // Tính điểm trung bình
  const totalScore = grades.reduce(
    (sum, g) =>
      sum + testsPerGrade.reduce((subSum, key) => subSum + (g[key] || 0), 0),
    0
  );

  const avgScore = totalScore / totalTests;

  // Lấy ngày bài kiểm tra gần nhất
  const latestTestDate = await getLatestStudentGradeDate(studentId);

  return {
    totalTests,
    avgScore: Number(avgScore.toFixed(2)),
    latestTestDate,
  };
};

// Lấy dữ liệu chi tiết cho bảng điểm
export const getStudentGradesTable = async (studentId) => {
  const grades = await getStudentGrades(studentId);
  const classes = await classApi.getAll();

  const data = [];

  grades.forEach((g) => {
    const cls = classes.find((c) => Number(c.class_id) === Number(g.class_id));
    if (!cls) return;

    const tests = [
      {
        type: "Điểm chuyên cần",
        score: g.attendance_score,
        remark: g.attendance_remark,
      },
      {
        type: "Bài tập",
        score: g.assignment_score,
        remark: g.assignment_remark,
      },
      {
        type: "Giữa kỳ Listening",
        score: g.midterm_listening,
        remark: g.midterm_listening_remark,
      },
      {
        type: "Giữa kỳ Speaking",
        score: g.midterm_speaking,
        remark: g.midterm_speaking_remark,
      },
      {
        type: "Giữa kỳ Reading",
        score: g.midterm_reading,
        remark: g.midterm_reading_remark,
      },
      {
        type: "Giữa kỳ Writing",
        score: g.midterm_writing,
        remark: g.midterm_writing_remark,
      },
      {
        type: "Cuối kỳ Listening",
        score: g.final_listening,
        remark: g.final_listening_remark,
      },
      {
        type: "Cuối kỳ Speaking",
        score: g.final_speaking,
        remark: g.final_speaking_remark,
      },
      {
        type: "Cuối kỳ Reading",
        score: g.final_reading,
        remark: g.final_reading_remark,
      },
      {
        type: "Cuối kỳ Writing",
        score: g.final_writing,
        remark: g.final_writing_remark,
      },
    ];

    tests.forEach((t) => {
      data.push({
        class_name: cls.class_name,
        test_type: t.type,
        score: t.score,
        remark: t.remark,
      });
    });
  });

  return data;
};

/** ===============================
 * THÔNG TIN HỌC VIÊN
 * =============================== */

// Lấy thông tin user theo studentId
export const getStudentInfo = async (studentId) => {
  const users = await userApi.getAll();
  return users.find((u) => Number(u.user_id) === Number(studentId)) || null;
};

// Lấy cả info + latest grade
export const getStudentOverview = async (studentId) => {
  const [studentInfo, latestGrade] = await Promise.all([
    getStudentInfo(studentId),
    getLatestStudentGrade(studentId),
  ]);
  return { studentInfo, latestGrade };
};
/** ===============================
 * FEEDBACK HỌC VIÊN
 * =============================== */

// Lấy tất cả feedback của học viên
export const getStudentFeedbacks = async (studentId) => {
  const feedbacks = await feedbackApi.getAll();
  return Array.isArray(feedbacks)
    ? feedbacks.filter((f) => Number(f.user_id) === Number(studentId))
    : [];
};

// Gửi feedback mới
export const createFeedback = async ({
  user_id,
  class_id,
  course_id,
  rating,
  comment,
}) => {
  const payload = {
    user_id,
    class_id,
    course_id,
    rating,
    comment,
    created_at: new Date().toISOString(),
  };
  return feedbackApi.create(payload);
};

/** ===============================
 * BÀI TẬP
 * =============================== */

// Lấy assignments kèm trạng thái + chấm điểm
export const getStudentAssignmentsWithStatus = async (studentId) => {
  const assignments = await assignmentApi.getAll();
  const submissions = await submissionApi.getAll();
  const classes = await classApi.getAll();
  const courses = await courseApi.getAll();
  const enrollments = await enrollmentApi.getAll();

  // lấy danh sách class mà học viên này học
  const myClassIds = enrollments
    .filter((en) => Number(en.user_id) === Number(studentId))
    .map((en) => Number(en.class_id));

  return (
    assignments
      // chỉ lấy assignment thuộc những lớp mà học viên đó học
      .filter((a) => myClassIds.includes(Number(a.class_id)))
      .map((a) => {
        // tìm submission của học viên này cho assignment này
        const submission = submissions.find(
          (s) =>
            Number(s.user_id) === Number(studentId) &&
            Number(s.material_id) === Number(a.material_id)
        );

        const grade =
          submission?.grade !== undefined
            ? {
                assignment_score: submission.grade,
                feedback: submission.feedback,
                corrected_file_url: submission.corrected_file_url,
              }
            : null;

        const dueDate = a.due_date ? new Date(a.due_date) : null;
        const submittedAt = submission?.submitted_at
          ? new Date(submission.submitted_at)
          : null;

        let status = "Chưa nộp";
        if (submittedAt) {
          status = "Đã nộp";
          if (grade && grade.assignment_score !== null) status = "Đã chấm điểm";
          // nếu có nộp nhưng sau hạn thì:
          if (dueDate && submittedAt > dueDate) status = "Nộp trễ";
        } else if (dueDate && new Date() > dueDate) {
          status = "Quá hạn";
        }

        const classInfo = classes.find(
          (c) => Number(c.class_id) === Number(a.class_id)
        );
        const courseInfo = courses.find(
          (c) => Number(c.course_id) === Number(classInfo?.course_id)
        );

        return {
          ...a,
          submission,
          grade,
          status,
          class_name: classInfo?.class_name ?? null,
          course_name: courseInfo?.course_name ?? null,
        };
      })
  );
};

//AssignmentModal.jsx
const API_URL = "http://localhost:3001";

export async function submitAssignment(assignmentId, userId, fileUrl) {
  const newSubmission = {
    material_id: assignmentId,
    user_id: userId,
    file_url: fileUrl,
    submitted_at: new Date().toISOString(),
    grade: null,
    feedback: null,
    corrected_file_url: null,
    status: "Đã nộp"
  };
  const res = await fetch(`${API_URL}/submissions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newSubmission)
  });
  if (!res.ok) throw new Error(`Lỗi khi nộp bài: ${res.statusText}`);
  return res.json();
}

export async function updateAssignmentSubmission(submissionId, fileUrl) {
  if (!submissionId) throw new Error("submissionId không hợp lệ");
  const res = await fetch(`${API_URL}/submissions/${submissionId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      file_url: fileUrl,
      submitted_at: new Date().toISOString(),
    }),
  });
  if (!res.ok) throw new Error(`Không tìm thấy submission ${submissionId}`);
  return res.json();
}

export async function deleteAssignmentSubmission(submissionId) {
  if (!submissionId) return;
  const res = await fetch(`${API_URL}/submissions/${submissionId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`Không tìm thấy submission ${submissionId}`);
  return true;
}

export const STATUS = {
  NOT_SUBMITTED: "Chưa nộp",
  SUBMITTED: "Đã nộp",
  GRADED: "Đã chấm",
  LATE_SUBMISSION: "Nộp trễ",
  LATE: "Quá hạn",
};