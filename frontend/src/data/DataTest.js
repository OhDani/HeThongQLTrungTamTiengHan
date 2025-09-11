// mở rộng data class 7, chat
// Mock data: Users
const users = [
  { user_id: 1, username: "student01", full_name: "Nguyễn Văn Thanh", email: "nguyenvan.thanh@student.salio.com", password: "1", phone: "0901230001", address: "123 Lê Lợi, Hà Nội", role: "Học viên", note: "Năng động, cần cải thiện phát âm" },
  { user_id: 2, username: "student02", full_name: "Trần Thị Lan", email: "tranthi.lan@student.salio.com", password: "2", phone: "0901230002", address: "45 Ngô Gia Tự, Hà Nội", role: "Học viên", note: "Chăm chỉ, hay hỏi bài" },
  { user_id: 3, username: "student03", full_name: "Lê Minh Hoàng", email: "leminh.hoang@student.salio.com", password: "3", phone: "0901230003", address: "12 Trần Phú, Hải Phòng", role: "Học viên", note: "Cần hỗ trợ ngữ pháp" },
  { user_id: 4, username: "student04", full_name: "Phạm Thị Hương", email: "phamthi.huong@student.salio.com", password: "4", phone: "0901230004", address: "56 Nguyễn Huệ, Đà Nẵng", role: "Học viên", note: "" },
  { user_id: 5, username: "student05", full_name: "Đỗ Văn Nam", email: "dovan.nam@student.salio.com", password: "5", phone: "0901230005", address: "78 Hai Bà Trưng, TP.HCM", role: "Học viên", note: "Đi học đầy đủ" },
  { user_id: 6, username: "teacher01", full_name: "Ngô Thị Mai", email: "ngo.mai@teacher.salio.com", password: "6", phone: "0902230001", address: "23 Lạch Tray, Hải Phòng", role: "Giảng viên", note: "Giảng dạy lớp Sơ cấp A1" },
  { user_id: 7, username: "teacher02", full_name: "Hoàng Văn Quân", email: "hoang.quan@teacher.salio.com", password: "7", phone: "0902230002", address: "89 Lê Duẩn, Hà Nội", role: "Giảng viên", note: "Chuyên dạy TOPIK" },
  { user_id: 8, username: "manager01", full_name: "Trần Thị Bích", email: "bich.tran@manager.salio.com", password: "8", phone: "0903230001", address: "11 Nguyễn Trãi, Hà Nội", role: "Quản lý học vụ", note: "Theo dõi tiến độ học viên" },
  { user_id: 9, username: "admin01", full_name: "Phạm Văn Hùng", email: "hung.pham@admin.salio.com", password: "9", phone: "0904230001", address: "33 Nguyễn Văn Cừ, TP.HCM", role: "Quản lý hệ thống", note: "" },
  { user_id: 10, username: "student06", full_name: "Nguyễn Thị Hoa", email: "hoa.nguyen@student.salio.com", password: "10", phone: "0901230006", address: "67 Võ Văn Tần, Huế", role: "Học viên", note: "Mới nhập học" },
  { user_id: 11, username: "student07", full_name: "Phan Văn Toàn", email: "phan.toan@student.salio.com", password: "11", phone: "0901230007", address: "22 Pasteur, TP.HCM", role: "Học viên", note: "" },
  { user_id: 12, username: "student08", full_name: "Vũ Thị Thảo", email: "vu.thao@student.salio.com", password: "12", phone: "0901230008", address: "14 Điện Biên Phủ, Hà Nội", role: "Học viên", note: "Thường xuyên vắng" },
  { user_id: 13, username: "student09", full_name: "Nguyễn Văn An", email: "nguyen.an@student.salio.com", password: "13", phone: "0901230009", address: "19 Hoàng Hoa Thám, Hà Nội", role: "Học viên", note: "Thành viên năng nổ" },
  { user_id: 14, username: "student10", full_name: "Trần Thị Mai", email: "tran.mai@student.salio.com", password: "14", phone: "0901230010", address: "88 Phạm Văn Đồng, Hà Nội", role: "Học viên", note: "Cần hỗ trợ phát âm" },
  { user_id: 15, username: "student11", full_name: "Phạm Minh Đức", email: "pham.duc@student.salio.com", password: "15", phone: "0901230011", address: "25 Nguyễn Thái Học, Hải Dương", role: "Học viên", note: "" },
  { user_id: 16, username: "student12", full_name: "Đoàn Thị Hạnh", email: "doan.hanh@student.salio.com", password: "16", phone: "0901230012", address: "61 Nguyễn Văn Linh, Đà Nẵng", role: "Học viên", note: "Hay đi học muộn" },
  { user_id: 17, username: "student13", full_name: "Lý Văn Tuấn", email: "ly.tuan@student.salio.com", password: "17", phone: "0901230013", address: "34 Bạch Đằng, Quảng Ninh", role: "Học viên", note: "Hòa đồng, giúp đỡ bạn bè" },
  { user_id: 18, username: "student14", full_name: "Nguyễn Thị Yến", email: "nguyen.yen@student.salio.com", password: "18", phone: "0901230014", address: "90 Nguyễn Chí Thanh, Hà Nội", role: "Học viên", note: "Tiến bộ nhanh" },
  { user_id: 19, username: "student15", full_name: "Hoàng Văn Long", email: "hoang.long@student.salio.com", password: "19", phone: "0901230015", address: "77 Cách Mạng Tháng 8, TP.HCM", role: "Học viên", note: "" },
  { user_id: 20, username: "student16", full_name: "Bùi Thị Hằng", email: "bui.hang@student.salio.com", password: "20", phone: "0901230016", address: "101 Nguyễn Đình Chiểu, TP.HCM", role: "Học viên", note: "Chăm chỉ" },
  { user_id: 21, username: "student17", full_name: "Ngô Văn Khánh", email: "ngo.khanh@student.salio.com", password: "21", phone: "0901230017", address: "12 Hoàng Diệu, Huế", role: "Học viên", note: "Thường xuyên tham gia thảo luận" },
  { user_id: 22, username: "student18", full_name: "Phan Thị Liên", email: "phan.lien@student.salio.com", password: "22", phone: "0901230018", address: "55 Lê Lai, Hà Nội", role: "Học viên", note: "Học lực khá" }
];


// Mock data: Courses
const courses = [
  { course_id: 1, course_name: "Tiếng Hàn Sơ cấp 1", description: "Khóa học nền tảng cho người mới bắt đầu học tiếng Hàn. Bao gồm bảng chữ cái, phát âm, từ vựng cơ bản và mẫu câu đơn giản.", start_date: "2025-01-10", end_date: "2025-04-20", tuition_fee: 3500000, status: "Đang mở" },
  { course_id: 2, course_name: "Tiếng Hàn Sơ cấp 2", description: "Tiếp nối Sơ cấp 1, học viên được luyện nghe – nói nhiều hơn, mở rộng ngữ pháp cơ bản và giao tiếp hàng ngày.", start_date: "2025-02-15", end_date: "2025-05-25", tuition_fee: 3800000, status: "Chưa mở" },
  { course_id: 3, course_name: "Tiếng Hàn Trung cấp 1", description: "Khóa học giúp học viên giao tiếp lưu loát hơn, tiếp cận ngữ pháp trung cấp và các đoạn hội thoại phức tạp.", start_date: "2025-03-05", end_date: "2025-06-15", tuition_fee: 4200000, status: "Đang mở" },
  { course_id: 4, course_name: "Tiếng Hàn Trung cấp 2", description: "Mở rộng kỹ năng viết và thuyết trình. Học viên sẽ làm quen với các đoạn văn bản học thuật.", start_date: "2024-09-01", end_date: "2024-12-15", tuition_fee: 4500000, status: "Hoàn thành" },
  { course_id: 5, course_name: "Luyện thi TOPIK I", description: "Khóa học luyện thi TOPIK I, tập trung vào kỹ năng nghe và đọc để đạt chứng chỉ TOPIK cấp 1-2.", start_date: "2025-04-01", end_date: "2025-07-10", tuition_fee: 5000000, status: "Chưa mở" },
  { course_id: 6, course_name: "Luyện thi TOPIK II", description: "Khóa học chuyên sâu cho TOPIK II, bao gồm kỹ năng viết và phân tích ngữ pháp nâng cao.", start_date: "2025-01-20", end_date: "2025-05-01", tuition_fee: 6500000, status: "Đang mở" },
  { course_id: 7, course_name: "Tiếng Hàn Cao cấp 1", description: "Khóa học hướng tới sử dụng tiếng Hàn trong môi trường chuyên nghiệp và học thuật.", start_date: "2024-08-10", end_date: "2024-11-20", tuition_fee: 7000000, status: "Hoàn thành" },
  { course_id: 8, course_name: "Tiếng Hàn Cao cấp 2", description: "Khóa học nâng cao kỹ năng nghiên cứu, dịch thuật và thuyết trình học thuật bằng tiếng Hàn.", start_date: "2025-05-05", end_date: "2025-08-15", tuition_fee: 7500000, status: "Chưa mở" }
];

// Mock data: Classes
const classes = [
  { class_id: 1, course_id: 1, teacher_id: 7, class_name: "Sơ cấp A1", schedule: "T2-T4, 18:00-20:00", room: "P101", sizemax: 10, size: 5, status: "Đang mở" },
  { class_id: 2, course_id: 1, teacher_id: 6, class_name: "Sơ cấp A2", schedule: "T3-T5, 19:00-21:00", room: "P102", sizemax: 10, size: 4, status: "Đang mở" },
  { class_id: 3, course_id: 2, teacher_id: 7, class_name: "Sơ cấp B1", schedule: "T7-CN, 08:00-10:00", room: "P201", sizemax: 5, size: 4, status: "Đang mở" },
  { class_id: 4, course_id: 3, teacher_id: 6, class_name: "Trung cấp C1", schedule: "T2-T5, 18:30-20:30", room: "P301", sizemax: 20, size: 5, status: "Đang mở" },
  { class_id: 5, course_id: 4, teacher_id: 7, class_name: "Trung cấp C2", schedule: "T3-T6, 18:00-20:00", room: "P302", sizemax: 20, size: 20, status: "Hoàn thành" },
  { class_id: 6, course_id: 5, teacher_id: 6, class_name: "TOPIK I D1", schedule: "T6-CN, 14:00-16:00", room: "P401", sizemax: 40, size: 0, status: "Chưa mở" },
  { class_id: 7, course_id: 6, teacher_id: 7, class_name: "TOPIK II D2", schedule: "T2-T4, 18:00-20:00", room: "P402", sizemax: 35, size: 28, status: "Đang mở" },
  { class_id: 8, course_id: 7, teacher_id: 6, class_name: "Cao cấp E1", schedule: "T3-T5, 18:00-20:00", room: "P501", sizemax: 15, size: 15, status: "Hoàn thành" },
  { class_id: 9, course_id: 8, teacher_id: 7, class_name: "Cao cấp E2", schedule: "T7-CN, 09:00-11:00", room: "P502", sizemax: 15, size: 0, status: "Chưa mở" }
];

//Mock data: Học viên trong lớp
const enrollments = [
  { enrollment_id: 1, student_id: 1, class_id: 1, status: "Đang học" },
  { enrollment_id: 2, student_id: 2, class_id: 1, status: "Đang học" },
  { enrollment_id: 3, student_id: 3, class_id: 1, status: "Đang học" },
  { enrollment_id: 4, student_id: 4, class_id: 1, status: "Đang học" },
  { enrollment_id: 5, student_id: 5, class_id: 1, status: "Đang học" },
  { enrollment_id: 6, student_id: 10, class_id: 2, status: "Đang học" },
  { enrollment_id: 7, student_id: 11, class_id: 2, status: "Đang học" },
  { enrollment_id: 8, student_id: 12, class_id: 2, status: "Đang học" },
  { enrollment_id: 9, student_id: 13, class_id: 2, status: "Đang học" },
  { enrollment_id: 10, student_id: 14, class_id: 3, status: "Đang học" },
  { enrollment_id: 11, student_id: 15, class_id: 3, status: "Đang học" },
  { enrollment_id: 12, student_id: 16, class_id: 3, status: "Đang học" },
  { enrollment_id: 13, student_id: 17, class_id: 3, status: "Đang học" },
  { enrollment_id: 14, student_id: 18, class_id: 4, status: "Đang học" },
  { enrollment_id: 15, student_id: 19, class_id: 4, status: "Đang học" },
  { enrollment_id: 16, student_id: 20, class_id: 4, status: "Đang học" },
  { enrollment_id: 17, student_id: 21, class_id: 4, status: "Đang học" },
  { enrollment_id: 18, student_id: 22, class_id: 4, status: "Đang học" },
  // học thêm lớp
  { enrollment_id: 19, student_id: 1, class_id: 2, status: "Đang học" },
  // từng đăng ký TOPIK nhưng hủy
  { enrollment_id: 20, student_id: 2, class_id: 4, status: "Hủy" }
];

//Mock data: Điểm danh
const attendance = [
  { attendance_id: 1, student_id: 1, class_id: 1, date: "2024-02-01", status: "Có mặt" },
  { attendance_id: 2, student_id: 2, class_id: 1, date: "2024-02-01", status: "Có mặt" },
  { attendance_id: 3, student_id: 3, class_id: 1, date: "2024-02-01", status: "Muộn" },
  { attendance_id: 4, student_id: 4, class_id: 1, date: "2024-02-01", status: "Có mặt" },
  { attendance_id: 5, student_id: 5, class_id: 1, date: "2024-02-01", status: "Vắng" },

  { attendance_id: 6, student_id: 1, class_id: 1, date: "2024-02-08", status: "Có mặt" },
  { attendance_id: 7, student_id: 2, class_id: 1, date: "2024-02-08", status: "Có mặt" },
  { attendance_id: 8, student_id: 3, class_id: 1, date: "2024-02-08", status: "Có mặt" },
  { attendance_id: 9, student_id: 4, class_id: 1, date: "2024-02-08", status: "Vắng" },
  { attendance_id: 10, student_id: 5, class_id: 1, date: "2024-02-08", status: "Có mặt" },

  // Lớp 2 (class_id: 2)
  { attendance_id: 37, student_id: 1, class_id: 2, date: "2024-02-02", status: "Có mặt" },
  { attendance_id: 11, student_id: 10, class_id: 2, date: "2024-02-02", status: "Có mặt" },
  { attendance_id: 12, student_id: 11, class_id: 2, date: "2024-02-02", status: "Có mặt" },
  { attendance_id: 13, student_id: 12, class_id: 2, date: "2024-02-02", status: "Muộn" },
  { attendance_id: 14, student_id: 13, class_id: 2, date: "2024-02-02", status: "Có mặt" },

  { attendance_id: 38, student_id: 1, class_id: 2, date: "2024-02-09", status: "Có mặt" },
  { attendance_id: 15, student_id: 10, class_id: 2, date: "2024-02-09", status: "Có mặt" },
  { attendance_id: 16, student_id: 11, class_id: 2, date: "2024-02-09", status: "Vắng" },
  { attendance_id: 17, student_id: 12, class_id: 2, date: "2024-02-09", status: "Có mặt" },
  { attendance_id: 18, student_id: 13, class_id: 2, date: "2024-02-09", status: "Có mặt" },

  // Lớp 3 (class_id: 3)
  { attendance_id: 19, student_id: 14, class_id: 3, date: "2024-02-03", status: "Có mặt" },
  { attendance_id: 20, student_id: 15, class_id: 3, date: "2024-02-03", status: "Có mặt" },
  { attendance_id: 21, student_id: 16, class_id: 3, date: "2024-02-03", status: "Vắng" },
  { attendance_id: 22, student_id: 17, class_id: 3, date: "2024-02-03", status: "Có mặt" },

  { attendance_id: 23, student_id: 14, class_id: 3, date: "2024-02-10", status: "Có mặt" },
  { attendance_id: 24, student_id: 15, class_id: 3, date: "2024-02-10", status: "Có mặt" },
  { attendance_id: 25, student_id: 16, class_id: 3, date: "2024-02-10", status: "Có mặt" },
  { attendance_id: 26, student_id: 17, class_id: 3, date: "2024-02-10", status: "Muộn" },

  // Lớp 4 (class_id: 4)
  { attendance_id: 27, student_id: 18, class_id: 4, date: "2024-02-04", status: "Có mặt" },
  { attendance_id: 28, student_id: 19, class_id: 4, date: "2024-02-04", status: "Có mặt" },
  { attendance_id: 29, student_id: 20, class_id: 4, date: "2024-02-04", status: "Có mặt" },
  { attendance_id: 30, student_id: 21, class_id: 4, date: "2024-02-04", status: "Vắng" },
  { attendance_id: 31, student_id: 22, class_id: 4, date: "2024-02-04", status: "Có mặt" },

  { attendance_id: 32, student_id: 18, class_id: 4, date: "2024-02-11", status: "Có mặt" },
  { attendance_id: 33, student_id: 19, class_id: 4, date: "2024-02-11", status: "Muộn" },
  { attendance_id: 34, student_id: 20, class_id: 4, date: "2024-02-11", status: "Có mặt" },
  { attendance_id: 35, student_id: 21, class_id: 4, date: "2024-02-11", status: "Có mặt" },
  { attendance_id: 36, student_id: 22, class_id: 4, date: "2024-02-11", status: "Có mặt" }
];

//Mock data: bài tập/Tài liệu
const assignments = [
  { material_id: 1, class_id: 1, teacher_id: 6, title: "Bài tập Từ vựng - Tuần 1", description: "Học thuộc và viết lại 20 từ mới đã học", file_url: null, url: null, due_date: "2024-02-05", type: "Bài tập", category: null, created_at: "2024-02-01 09:00:00" },
  { material_id: 2, class_id: 1, teacher_id: 6, title: "Ngữ pháp cơ bản: Câu chào hỏi", description: "Tài liệu PDF về cách chào hỏi và giới thiệu bản thân", file_url: "materials/grammar_greetings.pdf", url: null, due_date: null, type: "Tài liệu", category: "Ngữ pháp", created_at: "2024-02-01 09:30:00" },

  { material_id: 3, class_id: 2, teacher_id: 6, title: "Bài tập Nghe - Tuần 2", description: "Nghe đoạn hội thoại và trả lời câu hỏi", file_url: "materials/listening_task1.docx", url: null, due_date: "2024-02-12", type: "Bài tập", category: null, created_at: "2024-02-06 08:45:00" },
  { material_id: 4, class_id: 2, teacher_id: 6, title: "Từ vựng chủ đề Gia đình", description: "Danh sách từ vựng và hình ảnh minh họa về chủ đề Gia đình", file_url: null, url: "https://salio.com/family-vocab", due_date: null, type: "Tài liệu", category: "Từ vựng", created_at: "2024-02-06 09:10:00" },

  { material_id: 5, class_id: 3, teacher_id: 7, title: "Bài tập Viết - Tuần 3", description: "Viết một đoạn văn 200 chữ về sở thích cá nhân", file_url: null, url: null, due_date: "2024-02-20", type: "Bài tập", category: null, created_at: "2024-02-10 10:00:00" },
  { material_id: 6, class_id: 3, teacher_id: 7, title: "Ngữ pháp nâng cao: Liên từ", description: "Slide giảng về cách sử dụng liên từ trong câu phức", file_url: "materials/conjunctions_slide.pptx", url: null, due_date: null, type: "Tài liệu", category: "Ngữ pháp", created_at: "2024-02-10 10:20:00" },

  { material_id: 7, class_id: 4, teacher_id: 7, title: "Đề luyện TOPIK - Listening", description: "Bài nghe luyện thi TOPIK I kèm đáp án", file_url: "materials/topik_listening.pdf", url: null, due_date: "2024-02-25", type: "Bài tập", category: null, created_at: "2024-02-15 08:30:00" },
  { material_id: 8, class_id: 4, teacher_id: 7, title: "Tài liệu tham khảo TOPIK", description: "Link tham khảo đề thi TOPIK các năm trước", file_url: null, url: "https://salio.com/topik-past-papers", due_date: null, type: "Tài liệu", category: "Tài liệu tham khảo", created_at: "2024-02-15 08:45:00" }
];

//Mock data: FlashCard
const flashcards = [

  { flashcard_id: 1, material_id: 4, term: "아버지 ", definition: "Bố / Cha", image_url: "images/family/father.png" },
  { flashcard_id: 2, material_id: 4, term: "어머니 ", definition: "Mẹ", image_url: "images/family/mother.png" },
  { flashcard_id: 3, material_id: 4, term: "형 ", definition: "Anh trai (nam gọi)", image_url: "images/family/older_brother.png" },
  { flashcard_id: 4, material_id: 4, term: "누나 ", definition: "Chị gái (nam gọi)", image_url: "images/family/older_sister.png" },
  { flashcard_id: 5, material_id: 4, term: "동생 ", definition: "Em trai / Em gái", image_url: "images/family/younger_sibling.png" },
  { flashcard_id: 6, material_id: 4, term: "할아버지 ", definition: "Ông", image_url: "images/family/grandfather.png" },
  { flashcard_id: 7, material_id: 4, term: "할머니", definition: "Bà", image_url: "images/family/grandmother.png" }
];

const submissions = [

  { submission_id: 1, material_id: 1, student_id: 1, file_url: "submissions/vocab1_student01.docx", submitted_at: "2024-02-04 19:00:00", grade: 88, feedback: "Thuộc từ khá tốt.", corrected_file_url: "submissions/vocab1_student01_corrected.docx", status: "Đã chấm" },
  { submission_id: 2, material_id: 1, student_id: 2, file_url: "submissions/vocab1_student02.docx", submitted_at: "2024-02-05 08:20:00", grade: 95, feedback: "Rất tốt, chính tả chuẩn.", corrected_file_url: "submissions/vocab1_student02_corrected.docx", status: "Đã chấm" },
  { submission_id: 3, material_id: 1, student_id: 3, file_url: null, submitted_at: null, grade: null, feedback: null, corrected_file_url: null, status: "Chưa nộp" },
  { submission_id: 4, material_id: 1, student_id: 4, file_url: "submissions/vocab1_student04.docx", submitted_at: "2024-02-05 23:50:00", grade: null, feedback: null, corrected_file_url: null, status: "Nộp trễ" },
  { submission_id: 5, material_id: 1, student_id: 5, file_url: "submissions/vocab1_student05.docx", submitted_at: "2024-02-04 20:10:00", grade: 70, feedback: "Cần chăm chỉ hơn.", corrected_file_url: "submissions/vocab1_student05_corrected.docx", status: "Đã chấm" },

  { submission_id: 6, material_id: 3, student_id: 10, file_url: "submissions/listening2_student10.docx", submitted_at: "2024-02-11 21:15:00", grade: 75, feedback: "Hiểu ý chính, thiếu chi tiết.", corrected_file_url: null, status: "Đã chấm" },
  { submission_id: 7, material_id: 3, student_id: 11, file_url: "submissions/listening2_student11.docx", submitted_at: "2024-02-12 09:00:00", grade: null, feedback: null, corrected_file_url: null, status: "Chưa chấm" },
  { submission_id: 8, material_id: 3, student_id: 12, file_url: "submissions/listening2_student12.docx", submitted_at: null, grade: null, feedback: null, corrected_file_url: null, status: "Chưa nộp" },
  { submission_id: 9, material_id: 3, student_id: 13, file_url: "submissions/listening2_student13.docx", submitted_at: "2024-02-12 10:15:00", grade: 85, feedback: "Trả lời đúng hầu hết.", corrected_file_url: null, status: "Đã chấm" },
  { submission_id: 10, material_id: 3, student_id: 1, file_url: "submissions/listening2_student01.docx", submitted_at: "2024-02-12 09:40:00", grade: 90, feedback: "Khá tốt, nghe chuẩn.", corrected_file_url: null, status: "Đã chấm" },

  { submission_id: 11, material_id: 5, student_id: 14, file_url: "submissions/writing3_student14.docx", submitted_at: "2024-02-19 18:45:00", grade: 90, feedback: "Bài viết mạch lạc.", corrected_file_url: "submissions/writing3_student14_corrected.docx", status: "Đã chấm" },
  { submission_id: 12, material_id: 5, student_id: 15, file_url: "submissions/writing3_student15.docx", submitted_at: "2024-02-20 11:10:00", grade: 70, feedback: "Nhiều lỗi ngữ pháp.", corrected_file_url: "submissions/writing3_student15_corrected.docx", status: "Đã chấm" },
  { submission_id: 13, material_id: 5, student_id: 16, file_url: null, submitted_at: null, grade: null, feedback: null, corrected_file_url: null, status: "Chưa nộp" },
  { submission_id: 14, material_id: 5, student_id: 17, file_url: "submissions/writing3_student17.docx", submitted_at: "2024-02-20 10:30:00", grade: 82, feedback: "Ý tưởng tốt, cần cải thiện diễn đạt.", corrected_file_url: "submissions/writing3_student17_corrected.docx", status: "Đã chấm" },

  { submission_id: 15, material_id: 7, student_id: 18, file_url: "submissions/topik_listening_student18.pdf", submitted_at: "2024-02-24 20:30:00", grade: 82, feedback: "Nghe ổn, sót vài câu.", corrected_file_url: "submissions/topik_listening_student18_corrected.pdf", status: "Đã chấm" },
  { submission_id: 16, material_id: 7, student_id: 19, file_url: "submissions/topik_listening_student19.pdf", submitted_at: "2024-02-25 09:15:00", grade: null, feedback: null, corrected_file_url: null, status: "Chưa chấm" },
  { submission_id: 17, material_id: 7, student_id: 20, file_url: null, submitted_at: null, grade: null, feedback: null, corrected_file_url: null, status: "Chưa nộp" },
  { submission_id: 18, material_id: 7, student_id: 21, file_url: "submissions/topik_listening_student21.pdf", submitted_at: "2024-02-25 22:00:00", grade: 95, feedback: "Rất tốt, đạt chuẩn TOPIK I.", corrected_file_url: "submissions/topik_listening_student21_corrected.pdf", status: "Đã chấm" },
  { submission_id: 19, material_id: 7, student_id: 22, file_url: "submissions/topik_listening_student22.pdf", submitted_at: "2024-02-25 21:00:00", grade: 78, feedback: "Cần luyện tập thêm.", corrected_file_url: "submissions/topik_listening_student22_corrected.pdf", status: "Đã chấm" }
];

//mock data Điểm
const grades = [
  { grade_id: 1, student_id: 1, class_id: 1, attendance_score: 95, attendance_remark: "Đi học đều, đúng giờ", assignment_score: 89, assignment_remark: "Hoàn thành đầy đủ bài tập", midterm_listening: 85, midterm_listening_remark: "Nghe khá tốt", midterm_speaking: 80, midterm_speaking_remark: "Nói trôi chảy, còn chậm", midterm_reading: 88, midterm_reading_remark: "Đọc tốt", midterm_writing: 82, midterm_writing_remark: "Viết ổn, ít lỗi", final_listening: 90, final_listening_remark: "Nghe tiến bộ", final_speaking: 85, final_speaking_remark: "Tự tin hơn khi nói", final_reading: 92, final_reading_remark: "Đọc lưu loát", final_writing: 86, final_writing_remark: "Viết mạch lạc", overall_avg: 87.2 },
  { grade_id: 2, student_id: 2, class_id: 1, attendance_score: 100, attendance_remark: "Chuyên cần tốt", assignment_score: 95, assignment_remark: "Bài tập xuất sắc", midterm_listening: 90, midterm_listening_remark: "Nghe nhanh nhạy", midterm_speaking: 88, midterm_speaking_remark: "Phát âm tốt", midterm_reading: 92, midterm_reading_remark: "Đọc hiểu tốt", midterm_writing: 91, midterm_writing_remark: "Viết rõ ràng", final_listening: 93, final_listening_remark: "Nghe gần như hoàn hảo", final_speaking: 90, final_speaking_remark: "Nói tự tin", final_reading: 95, final_reading_remark: "Đọc xuất sắc", final_writing: 92, final_writing_remark: "Bài viết mạch lạc", overall_avg: 92.2 },
  { grade_id: 3, student_id: 3, class_id: 1, attendance_score: 85, attendance_remark: "Thi thoảng đi muộn", assignment_score: 70, assignment_remark: "Thiếu bài tập", midterm_listening: 72, midterm_listening_remark: "Nghe chưa tốt", midterm_speaking: 68, midterm_speaking_remark: "Còn ngập ngừng", midterm_reading: 75, midterm_reading_remark: "Đọc chậm", midterm_writing: 70, midterm_writing_remark: "Nhiều lỗi ngữ pháp", final_listening: 78, final_listening_remark: "Có cải thiện", final_speaking: 72, final_speaking_remark: "Tự tin hơn chút", final_reading: 76, final_reading_remark: "Đọc nhanh hơn", final_writing: 74, final_writing_remark: "Có tiến bộ", overall_avg: 74.0 },
  { grade_id: 4, student_id: 4, class_id: 1, attendance_score: 90, attendance_remark: "Chuyên cần, đôi lúc vắng", assignment_score: 85, assignment_remark: "Hoàn thành hầu hết bài tập", midterm_listening: 80, midterm_listening_remark: "Nghe ổn", midterm_speaking: 78, midterm_speaking_remark: "Cần tự tin hơn", midterm_reading: 82, midterm_reading_remark: "Đọc tương đối tốt", midterm_writing: 79, midterm_writing_remark: "Viết còn đơn giản", final_listening: 85, final_listening_remark: "Nghe rõ ràng hơn", final_speaking: 82, final_speaking_remark: "Nói lưu loát hơn", final_reading: 87, final_reading_remark: "Đọc hiểu nhanh hơn", final_writing: 84, final_writing_remark: "Câu văn tốt hơn", overall_avg: 83.3 },
  { grade_id: 5, student_id: 5, class_id: 1, attendance_score: 92, attendance_remark: "Đi học đầy đủ", assignment_score: 90, assignment_remark: "Bài tập làm tốt", midterm_listening: 84, midterm_listening_remark: "Nghe ổn định", midterm_speaking: 81, midterm_speaking_remark: "Nói khá tốt", midterm_reading: 86, midterm_reading_remark: "Đọc hiểu ổn", midterm_writing: 83, midterm_writing_remark: "Viết rõ ràng", final_listening: 89, final_listening_remark: "Nghe nhạy hơn", final_speaking: 84, final_speaking_remark: "Nói tự tin", final_reading: 90, final_reading_remark: "Đọc hiểu tốt", final_writing: 87, final_writing_remark: "Bài viết mượt mà", overall_avg: 86.1 },

  { grade_id: 6, student_id: 10, class_id: 2, attendance_score: 93, attendance_remark: "Chuyên cần", assignment_score: 88, assignment_remark: "Làm bài tập nghiêm túc", midterm_listening: 84, midterm_listening_remark: "Nghe ổn", midterm_speaking: 82, midterm_speaking_remark: "Nói lưu loát", midterm_reading: 87, midterm_reading_remark: "Đọc hiểu khá", midterm_writing: 83, midterm_writing_remark: "Viết rõ ràng", final_listening: 89, final_listening_remark: "Nghe tiến bộ", final_speaking: 85, final_speaking_remark: "Nói tự nhiên", final_reading: 90, final_reading_remark: "Đọc nhanh", final_writing: 86, final_writing_remark: "Viết tốt", overall_avg: 86.7 },
  { grade_id: 7, student_id: 11, class_id: 2, attendance_score: 90, attendance_remark: "Đi học khá đều", assignment_score: 85, assignment_remark: "Hoàn thành đầy đủ", midterm_listening: 80, midterm_listening_remark: "Nghe chậm", midterm_speaking: 78, midterm_speaking_remark: "Phát âm còn cứng", midterm_reading: 82, midterm_reading_remark: "Đọc trung bình", midterm_writing: 80, midterm_writing_remark: "Viết đủ ý", final_listening: 84, final_listening_remark: "Nghe rõ hơn", final_speaking: 82, final_speaking_remark: "Nói tự tin hơn", final_reading: 85, final_reading_remark: "Đọc tốt hơn", final_writing: 83, final_writing_remark: "Viết rõ hơn", overall_avg: 83.0 },
  { grade_id: 8, student_id: 12, class_id: 2, attendance_score: 97, attendance_remark: "Không vắng buổi nào", assignment_score: 92, assignment_remark: "Bài tập rất tốt", midterm_listening: 88, midterm_listening_remark: "Nghe xuất sắc", midterm_speaking: 86, midterm_speaking_remark: "Nói mạch lạc", midterm_reading: 90, midterm_reading_remark: "Đọc tốt", midterm_writing: 87, midterm_writing_remark: "Viết ổn", final_listening: 92, final_listening_remark: "Nghe tốt", final_speaking: 90, final_speaking_remark: "Nói tốt", final_reading: 93, final_reading_remark: "Đọc nhanh", final_writing: 91, final_writing_remark: "Viết mạch lạc", overall_avg: 90.2 },
  { grade_id: 9, student_id: 13, class_id: 2, attendance_score: 85, attendance_remark: "Thỉnh thoảng vắng", assignment_score: 78, assignment_remark: "Bỏ sót vài bài tập", midterm_listening: 74, midterm_listening_remark: "Nghe còn yếu", midterm_speaking: 70, midterm_speaking_remark: "Nói ngập ngừng", midterm_reading: 76, midterm_reading_remark: "Đọc chậm", midterm_writing: 72, midterm_writing_remark: "Viết nhiều lỗi", final_listening: 78, final_listening_remark: "Nghe cải thiện", final_speaking: 75, final_speaking_remark: "Nói khá hơn", final_reading: 80, final_reading_remark: "Đọc tốt hơn", final_writing: 77, final_writing_remark: "Viết rõ hơn", overall_avg: 77.3 },
  { grade_id: 10, student_id: 1, class_id: 2, attendance_score: 96, attendance_remark: "Rất chuyên cần", assignment_score: 91, assignment_remark: "Bài tập xuất sắc", midterm_listening: 87, midterm_listening_remark: "Nghe nhanh", midterm_speaking: 85, midterm_speaking_remark: "Nói lưu loát", midterm_reading: 89, midterm_reading_remark: "Đọc tốt", midterm_writing: 86, midterm_writing_remark: "Viết chắc chắn", final_listening: 91, final_listening_remark: "Nghe rất tốt", final_speaking: 88, final_speaking_remark: "Nói tự tin", final_reading: 92, final_reading_remark: "Đọc xuất sắc", final_writing: 89, final_writing_remark: "Viết hay", overall_avg: 88.8 },

  { grade_id: 11, student_id: 14, class_id: 3, attendance_score: 94, attendance_remark: "Đi học đều", assignment_score: 89, assignment_remark: "Làm bài tập đầy đủ", midterm_listening: 86, midterm_listening_remark: "Nghe tốt", midterm_speaking: 84, midterm_speaking_remark: "Nói tự tin", midterm_reading: 88, midterm_reading_remark: "Đọc tốt", midterm_writing: 85, midterm_writing_remark: "Viết chắc chắn", final_listening: 90, final_listening_remark: "Nghe xuất sắc", final_speaking: 87, final_speaking_remark: "Nói tốt", final_reading: 92, final_reading_remark: "Đọc xuất sắc", final_writing: 88, final_writing_remark: "Viết tốt", overall_avg: 88.3 },
  { grade_id: 12, student_id: 15, class_id: 3, attendance_score: 91, attendance_remark: "Chuyên cần", assignment_score: 85, assignment_remark: "Bài tập khá tốt", midterm_listening: 82, midterm_listening_remark: "Nghe ổn", midterm_speaking: 80, midterm_speaking_remark: "Nói trôi chảy", midterm_reading: 84, midterm_reading_remark: "Đọc nhanh", midterm_writing: 81, midterm_writing_remark: "Viết rõ", final_listening: 87, final_listening_remark: "Nghe tốt hơn", final_speaking: 84, final_speaking_remark: "Nói tự nhiên hơn", final_reading: 89, final_reading_remark: "Đọc tốt", final_writing: 85, final_writing_remark: "Viết chắc chắn", overall_avg: 85.6 },
  { grade_id: 13, student_id: 16, class_id: 3, attendance_score: 88, attendance_remark: "Thi thoảng đi muộn", assignment_score: 80, assignment_remark: "Có thiếu bài tập", midterm_listening: 78, midterm_listening_remark: "Nghe trung bình", midterm_speaking: 76, midterm_speaking_remark: "Nói chậm", midterm_reading: 80, midterm_reading_remark: "Đọc chậm", midterm_writing: 77, midterm_writing_remark: "Viết đơn giản", final_listening: 82, final_listening_remark: "Nghe tốt hơn", final_speaking: 79, final_speaking_remark: "Nói khá hơn", final_reading: 84, final_reading_remark: "Đọc nhanh hơn", final_writing: 81, final_writing_remark: "Viết ổn hơn", overall_avg: 81.0 },
  { grade_id: 14, student_id: 17, class_id: 3, attendance_score: 92, attendance_remark: "Đi học đầy đủ", assignment_score: 87, assignment_remark: "Bài tập ổn", midterm_listening: 84, midterm_listening_remark: "Nghe tốt", midterm_speaking: 82, midterm_speaking_remark: "Nói lưu loát", midterm_reading: 86, midterm_reading_remark: "Đọc tốt", midterm_writing: 83, midterm_writing_remark: "Viết chắc", final_listening: 89, final_listening_remark: "Nghe xuất sắc", final_speaking: 86, final_speaking_remark: "Nói rất tốt", final_reading: 91, final_reading_remark: "Đọc nhanh", final_writing: 87, final_writing_remark: "Viết hay", overall_avg: 86.6 },

  { grade_id: 15, student_id: 18, class_id: 4, attendance_score: 95, attendance_remark: "Chuyên cần", assignment_score: 90, assignment_remark: "Bài tập xuất sắc", midterm_listening: 88, midterm_listening_remark: "Nghe tốt", midterm_speaking: 86, midterm_speaking_remark: "Nói tự tin", midterm_reading: 90, midterm_reading_remark: "Đọc tốt", midterm_writing: 87, midterm_writing_remark: "Viết chắc chắn", final_listening: 92, final_listening_remark: "Nghe xuất sắc", final_speaking: 89, final_speaking_remark: "Nói tốt", final_reading: 94, final_reading_remark: "Đọc xuất sắc", final_writing: 90, final_writing_remark: "Viết hay", overall_avg: 89.2 },
  { grade_id: 16, student_id: 19, class_id: 4, attendance_score: 93, attendance_remark: "Đi học đầy đủ", assignment_score: 88, assignment_remark: "Bài tập tốt", midterm_listening: 85, midterm_listening_remark: "Nghe khá", midterm_speaking: 83, midterm_speaking_remark: "Nói ổn", midterm_reading: 87, midterm_reading_remark: "Đọc tốt", midterm_writing: 84, midterm_writing_remark: "Viết khá", final_listening: 89, final_listening_remark: "Nghe tốt hơn", final_speaking: 86, final_speaking_remark: "Nói trôi chảy hơn", final_reading: 91, final_reading_remark: "Đọc xuất sắc", final_writing: 87, final_writing_remark: "Viết rõ ràng", overall_avg: 86.9 },
  { grade_id: 17, student_id: 20, class_id: 4, attendance_score: 90, attendance_remark: "Chuyên cần", assignment_score: 85, assignment_remark: "Bài tập đủ", midterm_listening: 82, midterm_listening_remark: "Nghe ổn", midterm_speaking: 80, midterm_speaking_remark: "Nói chậm", midterm_reading: 84, midterm_reading_remark: "Đọc trung bình", midterm_writing: 81, midterm_writing_remark: "Viết đơn giản", final_listening: 86, final_listening_remark: "Nghe khá hơn", final_speaking: 83, final_speaking_remark: "Nói tốt hơn", final_reading: 88, final_reading_remark: "Đọc nhanh hơn", final_writing: 84, final_writing_remark: "Viết rõ hơn", overall_avg: 84.0 },
  { grade_id: 18, student_id: 21, class_id: 4, attendance_score: 96, attendance_remark: "Không vắng buổi nào", assignment_score: 92, assignment_remark: "Bài tập xuất sắc", midterm_listening: 89, midterm_listening_remark: "Nghe giỏi", midterm_speaking: 87, midterm_speaking_remark: "Nói lưu loát", midterm_reading: 91, midterm_reading_remark: "Đọc xuất sắc", midterm_writing: 88, midterm_writing_remark: "Viết chắc chắn", final_listening: 93, final_listening_remark: "Nghe tuyệt vời", final_speaking: 90, final_speaking_remark: "Nói rất tốt", final_reading: 95, final_reading_remark: "Đọc siêu nhanh", final_writing: 91, final_writing_remark: "Viết hay", overall_avg: 90.8 },
  { grade_id: 19, student_id: 22, class_id: 4, attendance_score: 89, attendance_remark: "Thi thoảng đi muộn", assignment_score: 84, assignment_remark: "Làm bài khá", midterm_listening: 81, midterm_listening_remark: "Nghe trung bình", midterm_speaking: 79, midterm_speaking_remark: "Nói chậm", midterm_reading: 83, midterm_reading_remark: "Đọc ổn", midterm_writing: 80, midterm_writing_remark: "Viết còn yếu", final_listening: 85, final_listening_remark: "Nghe tốt hơn", final_speaking: 82, final_speaking_remark: "Nói khá hơn", final_reading: 87, final_reading_remark: "Đọc nhanh hơn", final_writing: 83, final_writing_remark: "Viết rõ hơn", overall_avg: 83.3 }
];

//mock data: Thông báo
const notifications = [
  { notification_id: 1, sender_id: 8, title: "Chào mừng học viên mới", message: "Chào mừng các bạn học viên đã đăng ký khóa Sơ cấp A1. Chúc các bạn học tập thật tốt!", receiver_role: "Học viên", receiver_id: null, created_at: "2024-01-05 09:00:00" },
  { notification_id: 2, sender_id: 8, title: "Lịch kiểm tra giữa kỳ", message: "Các lớp Sơ cấp A1 sẽ thi giữa kỳ vào ngày 2024-02-20. Đề nghị học viên ôn tập kỹ.", receiver_role: "Học viên", receiver_id: null, created_at: "2024-02-01 10:30:00" },
  { notification_id: 3, sender_id: 9, title: "Họp giáo viên tháng 2", message: "Mời toàn thể giảng viên tham dự họp chuyên môn ngày 2024-02-05 lúc 14h tại phòng hội thảo.", receiver_role: "Giảng viên", receiver_id: null, created_at: "2024-02-02 08:15:00" },
  { notification_id: 4, sender_id: 8, title: "Cập nhật học phí", message: "Phòng quản lý học vụ thông báo học phí học kỳ mùa xuân cần hoàn tất trước ngày 2024-02-15.", receiver_role: "Học viên", receiver_id: null, created_at: "2024-02-03 16:20:00" },
  { notification_id: 5, sender_id: 6, title: "Nhắc nhở nộp bài tập", message: "Bạn còn thiếu 2 bài tập, vui lòng nộp bổ sung trong tuần này.", receiver_role: "Học viên", receiver_id: 3, created_at: "2024-02-04 09:45:00" },
  { notification_id: 6, sender_id: 6, title: "Điểm danh lớp A1", message: "Giáo viên cần cập nhật điểm danh cho lớp A1 tuần 5.", receiver_role: "Giảng viên", receiver_id: 6, created_at: "2024-02-05 11:00:00" },
  { notification_id: 7, sender_id: 9, title: "Thông báo toàn hệ thống", message: "Hệ thống LMS sẽ bảo trì từ 00:00 đến 06:00 ngày 2024-02-10. Vui lòng không truy cập trong thời gian này.", receiver_role: "Tất cả", receiver_id: null, created_at: "2024-02-08 17:30:00" },
  { notification_id: 8, sender_id: 7, title: "Thông báo lớp TOPIK", message: "Các bạn học viên lớp TOPIK chú ý chuẩn bị bài thuyết trình vào buổi học tiếp theo.", receiver_role: "Học viên", receiver_id: null, created_at: "2024-02-12 09:20:00" }
];

//mockdata Feedback
const feedbacks = [
  { feedback_id: 1, student_id: 1, course_id: 1, class_id: 1, rating: 5, comment: 'Giảng viên rất tận tâm và nhiệt tình.', created_at: '2025-08-15 10:30:00' },
  { feedback_id: 2, student_id: 10, course_id: 1, class_id: 2, rating: 4, comment: 'Khóa học cung cấp kiến thức bổ ích, nhưng hơi nhanh.', created_at: '2025-08-16 14:45:00' },
  { feedback_id: 3, student_id: 2, course_id: 1, class_id: 1, rating: 3, comment: 'Lớp học thoải mái nhưng đôi khi ồn ào.', created_at: '2025-08-17 09:20:00' },
  { feedback_id: 4, student_id: 11, course_id: 1, class_id: 2, rating: 4, comment: 'Trung tâm có cơ sở vật chất tốt và tiện nghi.', created_at: '2025-08-18 11:00:00' },
  { feedback_id: 5, student_id: 3, course_id: 1, class_id: 1, rating: 2, comment: 'Giảng viên chưa giải thích rõ ràng một số nội dung.', created_at: '2025-08-19 16:10:00' },
  { feedback_id: 6, student_id: 14, course_id: 2, class_id: 3, rating: 5, comment: 'Khóa học rất thực tế và dễ áp dụng.', created_at: '2025-08-20 13:25:00' },
  { feedback_id: 7, student_id: 15, course_id: 2, class_id: 3, rating: 4, comment: 'Lớp học có không khí học tập tích cực.', created_at: '2025-08-21 10:50:00' },
  { feedback_id: 8, student_id: 18, course_id: 3, class_id: 4, rating: 3, comment: 'Dịch vụ trung tâm ổn nhưng cần cải thiện thông tin khóa học.', created_at: '2025-08-22 15:15:00' },
  { feedback_id: 9, student_id: 19, course_id: 3, class_id: 4, rating: 5, comment: 'Giảng viên truyền đạt dễ hiểu, nhiệt tình giải đáp.', created_at: '2025-08-23 09:05:00' },
  { feedback_id: 10, student_id: 20, course_id: 3, class_id: 4, rating: 4, comment: 'Khóa học hữu ích nhưng cần thêm bài tập thực hành.', created_at: '2025-08-24 14:40:00' }
];
