const API_URL = "http://localhost:3001";

// Hàm chung để tạo các API object
const createApi = (resource, idField = 'id') => ({
  getAll: async () => {
    const res = await fetch(`${API_URL}/${resource}`);
    return res.json();
  },
  getById: async (id) => {
    const res = await fetch(`${API_URL}/${resource}?${idField}=${id}`);
    return res.json();
  },
  create: async (data) => {
    const res = await fetch(`${API_URL}/${resource}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  update: async (id, data) => {
    const res = await fetch(`${API_URL}/${resource}/${id}`, {
      // Đổi từ "PUT" sang "PATCH" để cập nhật từng phần
      method: "PATCH", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  delete: async (id) => {
    return fetch(`${API_URL}/${resource}/${id}`, {
      method: "DELETE",
    });
  },
});

// Export API cho từng entity
export const userApi = createApi("users", "user_id"); 
export const courseApi = createApi("courses", "course_id"); 
export const classApi = createApi("classes", "class_id"); 
export const enrollmentApi = createApi("enrollments", "enrollment_id"); 
export const attendanceApi = createApi("attendance", "attendance_id");
export const assignmentApi = createApi("assignments", "material_id");
export const flashcardApi = createApi("flashcards", "flashcard_id");
export const submissionApi = createApi("submissions", "submission_id");
export const gradeApi = createApi("grades", "grade_id");
export const notificationApi = createApi("notifications", "notification_id");
export const feedbackApi = createApi("feedbacks", "feedback_id");
export const conversationApi = createApi("conversation", "conversation_id");
export const conversationmemberApi = createApi("conversationmember", "conversationmember_id");
export const messageApi = createApi("message", "message_id");