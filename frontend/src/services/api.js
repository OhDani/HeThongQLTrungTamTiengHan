const API_URL = "http://localhost:3001"; // JSON Server chạy ở port 3001

// Hàm chung cho mọi entity
const createApi = (resource) => ({
  getAll: async () => {
    const res = await fetch(`${API_URL}/${resource}`);
    return res.json();
  },
  getById: async (id) => {
    const res = await fetch(`${API_URL}/${resource}/${id}`);
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
      method: "PUT",
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
export const userApi = createApi("users");
export const courseApi = createApi("courses");
export const classApi = createApi("classes");
export const enrollmentApi = createApi("enrollments");
export const attendanceApi = createApi("attendance");
export const assignmentApi = createApi("assignments");
export const flashcardApi = createApi("flashcards");
export const submissionApi = createApi("submissions");
export const gradeApi = createApi("grades");
export const notificationApi = createApi("notifications");
export const feedbackApi = createApi("feedbacks");