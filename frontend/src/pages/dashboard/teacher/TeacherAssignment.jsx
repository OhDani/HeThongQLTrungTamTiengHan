import React, { useState, useEffect, useRef } from "react";
import Input from "../../../components/common/Input";
import Select from "../../../components/common/Select";
import TextArea from "../../../components/common/TextArea";
import Button from "../../../components/common/Button";
import { assignmentApi } from "../../../services/api";
import { useAuth } from "../../../contexts/AuthContext";

const TeacherAssignment = () => {
  const [form, setForm] = useState({
    type: "Bài tập",
    classId: "",
    dueDate: "",
    title: "",
    description: "",
    url: "",
    category: "",
    file: null,
    words: Array(3).fill({ han: "", viet: "" }),
  });

  const { user } = useAuth();
  const [avatar, setAvatar] = useState(null);
  const avatarInputRef = useRef(null);
  const [wordImages, setWordImages] = useState(form.words.map(() => null));
  const wordInputRefs = useRef([]);
  const [classOptions, setClassOptions] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchClasses = async () => {
      if (!user) {
        setErrorMessage("Vui lòng đăng nhập để xem danh sách lớp.");
        return;
      }

      try {
        const teacherId = Number(user.user_id);
        const [classesData, coursesData] = await Promise.all([
          fetch("http://localhost:3001/classes").then((res) => res.json()),
          fetch("http://localhost:3001/courses").then((res) => res.json()),
        ]);

        const myClasses = classesData
          .filter((c) => Number(c.teacher_id) === teacherId)
          .map((cls) => {
            const course = coursesData.find((c) => c.course_id === cls.course_id);
            return {
              value: cls.class_id,
              label: `${cls.class_name} - ${course ? course.course_name : "Unknown"}`,
            };
          });

        setClassOptions(myClasses);
        if (myClasses.length === 0)
          setErrorMessage("Không tìm thấy lớp nào cho giáo viên hiện tại.");
      } catch {
        setErrorMessage("Lỗi khi tải danh sách lớp.");
      }
    };

    fetchClasses();
  }, [user]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) setAvatar(file);
  };

  const handleWordChange = (index, field, value) => {
    const newWords = [...form.words];
    newWords[index] = { ...newWords[index], [field]: value };
    setForm((prev) => ({ ...prev, words: newWords }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.classId || !form.title) {
      alert("Vui lòng chọn lớp học và nhập tiêu đề!");
      return;
    }

    try {
      // ===== 1. Tạo assignment =====
      const materialId = Date.now();
      const newAssignment = {
        material_id: materialId,
        id: Date.now().toString().slice(-4),
        class_id: Number(form.classId),
        teacher_id: user ? Number(user.user_id) : null,
        title: form.title,
        description: form.type === "Bài tập" ? form.description : form.description || null,
        file_url: form.file ? form.file.name : null,
        url: form.url || null,
        due_date: form.type === "Bài tập" ? form.dueDate : null,
        type: form.type,
        category: form.type === "Tài liệu" ? form.category : null,
        created_at: new Date().toISOString().slice(0, 19).replace("T", " "),
      };

      await assignmentApi.create(newAssignment);

      // ===== 2. Nếu là tài liệu từ vựng → thêm flashcards =====
      if (form.type === "Tài liệu" && form.category === "Từ vựng") {
        const flashcardRequests = form.words.map((w, idx) => {
          const newFlashcard = {
            flashcard_id: Date.now() + idx,
            material_id: materialId,
            term: w.han,
            definition: w.viet,
            image_url: wordImages[idx] ? wordImages[idx].name : null,
            id: Math.random().toString(36).substring(2, 6),
          };
          return fetch("http://localhost:3001/flashcards", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newFlashcard),
          });
        });

        await Promise.all(flashcardRequests);
      }

      alert("Đã gửi dữ liệu thành công!");

      // Reset form
      setForm({
        type: "Bài tập",
        classId: "",
        dueDate: "",
        title: "",
        description: "",
        url: "",
        category: "",
        file: null,
        words: Array(3).fill({ han: "", viet: "" }),
      });
      setAvatar(null);
      setWordImages([]);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow mt-8">
      <h1 className="text-center font-bold text-lg mb-6">
        QUẢN LÝ TÀI LIỆU VÀ BÀI TẬP HỌC VIÊN
      </h1>

      {/* Radio Bài tập / Tài liệu */}
      <div className="flex gap-4 mb-4">
        {["Bài tập", "Tài liệu"].map((option) => (
          <label key={option} className="flex items-center gap-2">
            <Input
              type="radio"
              value={option}
              checked={form.type === option}
              onChange={() => setForm((prev) => ({ ...prev, type: option }))}
            />
            {option}
          </label>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Lớp học"
            value={form.classId}
            onChange={handleChange("classId")}
            options={classOptions}
          />

          {form.type === "Bài tập" ? (
            <Input
              label="Hạn nộp"
              type="date"
              value={form.dueDate}
              onChange={handleChange("dueDate")}
            />
          ) : (
            <Select
              label="Loại tài liệu"
              value={form.category}
              onChange={handleChange("category")}
              options={[
                { value: "Tham khảo", label: "Tham khảo" },
                { value: "Từ vựng", label: "Từ vựng" },
                { value: "Khác", label: "Khác" },
              ]}
            />
          )}
        </div>

        <Input
          label="Tiêu đề"
          type="text"
          value={form.title}
          onChange={handleChange("title")}
          placeholder="Nhập tiêu đề bài tập / tài liệu"
        />

        {/* Mô tả chỉ cho Bài tập */}
        {form.type === "Bài tập" && (
          <>
            <TextArea
              label="Mô tả"
              value={form.description}
              onChange={handleChange("description")}
              placeholder="Nhập mô tả chi tiết"
            />
            <Input
              label="URL tài liệu (Nếu có)"
              type="text"
              value={form.url}
              onChange={handleChange("url")}
              placeholder="Nhập URL"
              className="flex-1"
            />
          </>
        )}

        {/* Form Tài liệu */}
        {form.type === "Tài liệu" && (
          form.category === "Từ vựng" ? (
            <div className="space-y-6">
              {/* URL + File */}
              <Input
                label="URL tài liệu (Nếu có)"
                type="text"
                value={form.url}
                onChange={handleChange("url")}
                placeholder="Nhập URL từ vựng (nếu có)"
                className="w-full"
                noWrapper
              />

              <Input
                type="file"
                onChange={(e) => setForm(prev => ({ ...prev, file: e.target.files[0] }))}
                className="w-32"
                noWrapper
              />
              {form.file && <div className="mt-1 text-sm text-gray-700">{form.file.name}</div>}

              {/* Ảnh lớn */}
              <div
                className="w-48 h-48 bg-gray-200 flex items-center justify-center cursor-pointer mx-auto"
                onClick={() => avatarInputRef.current?.click()}
              >
                {avatar ? (
                  <img
                    src={URL.createObjectURL(avatar)}
                    alt="avatar"
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <span className="text-3xl font-bold text-gray-400">+</span>
                )}
              </div>
              <Input type="file" ref={avatarInputRef} onChange={handleAvatarChange} className="hidden" />

              {/* Bảng từ vựng */}
              <div className="grid grid-cols-2 gap-10">
                {form.words.map((word, i) => (
                  <React.Fragment key={i}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-12 h-12 bg-gray-300 flex items-center justify-center text-xs cursor-pointer"
                        onClick={() => wordInputRefs.current[i]?.click()}
                      >
                        {wordImages[i] ? (
                          <img
                            src={URL.createObjectURL(wordImages[i])}
                            alt={`word-${i}`}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <span className="text-0xl font-bold text-gray-400">+</span>
                        )}
                      </div>
                      <input
                        type="file"
                        ref={(el) => (wordInputRefs.current[i] = el)}
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const newImages = [...wordImages];
                            newImages[i] = file;
                            setWordImages(newImages);
                          }
                        }}
                      />
                      <Input
                        label={`Tiếng Hàn ${i + 1}`}
                        value={word.han}
                        onChange={(e) => handleWordChange(i, "han", e.target.value)}
                        className="flex-1"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Input
                        label={`Tiếng Việt ${i + 1}`}
                        value={word.viet}
                        onChange={(e) => handleWordChange(i, "viet", e.target.value)}
                        className="flex-1"
                      />
                      <button
                        type="button"
                        className="ml-2 text-red-500 font-bold"
                        onClick={() => {
                          setForm((prev) => ({
                            ...prev,
                            words: prev.words.filter((_, index) => index !== i),
                          }));
                          setWordImages((prev) => prev.filter((_, index) => index !== i));
                          wordInputRefs.current.splice(i, 1);
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  </React.Fragment>
                ))}
              </div>

              <Button
                type="button"
                onClick={() => {
                  setForm(prev => ({
                    ...prev,
                    words: [...prev.words, { han: "", viet: "" }],
                  }));
                  setWordImages(prev => [...prev, null]);
                }}
              >
                Thêm thẻ
              </Button>
            </div>
          ) : (
            <>
              <Input
                label="URL tài liệu (Nếu có)"
                type="text"
                value={form.url}
                onChange={handleChange("url")}
                placeholder="Nhập URL tài liệu (nếu có)"
                className="w-full"
                noWrapper
              />
              <Input
                type="file"
                onChange={(e) => setForm(prev => ({ ...prev, file: e.target.files[0] }))}
                className="w-32"
                noWrapper
              />
              {form.file && <div className="mt-1 text-sm text-gray-700">{form.file.name}</div>}

              <div
                className="w-48 h-48 bg-gray-200 flex items-center justify-center cursor-pointer mx-auto"
                onClick={() => avatarInputRef.current?.click()}
              >
                {avatar ? (
                  <img
                    src={URL.createObjectURL(avatar)}
                    alt="avatar"
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <span className="text-3xl font-bold text-gray-400">+</span>
                )}
              </div>
              <Input type="file" ref={avatarInputRef} onChange={handleAvatarChange} className="hidden" />

              <TextArea
                label="Nội dung tài liệu"
                value={form.description}
                onChange={handleChange("description")}
                placeholder="Nhập nội dung chi tiết cho tài liệu"
              />
            </>
          )
        )}

        <div className="flex justify-end mt-4">
          <Button type="submit">Tải lên</Button>
        </div>
      </form>
    </div>
  );
};

export default TeacherAssignment;
