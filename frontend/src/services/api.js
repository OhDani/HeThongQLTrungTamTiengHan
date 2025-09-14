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

//Hàm dùng để thay đổi Ghi chú của Giảng viên với Học viên
updateByUserId: async (userId, data) => {
    // Lấy record theo user_id
    const res = await fetch(`${API_URL}/${resource}?user_id=${userId}`);
    const users = await res.json();
    if (!users.length) throw new Error("User không tồn tại");

    const id = users[0].id; // json-server tạo id tự động
    const resUpdate = await fetch(`${API_URL}/${resource}/${id}`, {
      method: "PATCH", // PATCH chỉ update 1 phần
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return resUpdate.json();
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
export const conversationApi = createApi("conversation");
export const conversationmemberApi = createApi("conversationmember");
export const messageApi = createApi("message");
