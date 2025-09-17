import React, { useEffect, useState, useMemo } from "react";
import { courseApi, feedbackApi, userApi, classApi } from "../../../services/api";
import Card from "../../../components/common/Card";
import Select from "../../../components/common/Select";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import { FaStar, FaRegStar } from "react-icons/fa";
import { useAuth } from "../../../contexts/AuthContext";

const TeacherFeedback = () => {
  const { user } = useAuth();

  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [filters, setFilters] = useState({ course: "all", rating: "all", sort: "default" });
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    (async () => {
      const [c, s, cl, f] = await Promise.all([
        courseApi.getAll(),
        userApi.getAll(),
        classApi.getAll(),
        feedbackApi.getAll()
      ]);
      setCourses(c);
      setUsers(s);
      setClasses(cl);
      setFeedbacks(f);
    })();
  }, []);

  // Lấy class_id và course_id của các lớp mà giảng viên phụ trách
  const { teacherClassIds, teacherCourseIds } = useMemo(() => {
    const teacherClasses = classes.filter(cl => cl.user_id === user?.user_id);
    return {
      teacherClassIds: teacherClasses.map(cl => cl.class_id),
      teacherCourseIds: teacherClasses.map(cl => cl.course_id)
    };
  }, [classes, user]);

  // Lọc feedback
  const filtered = useMemo(() => {
    let fbs = feedbacks.filter(
      f =>
        teacherClassIds.includes(f.class_id) &&
        (filters.course === "all" || f.course_id === +filters.course) &&
        (filters.rating === "all" || f.rating === +filters.rating)
    );

    if (filters.sort === "positive") fbs.sort((a, b) => b.rating - a.rating);
    else if (filters.sort === "negative") fbs.sort((a, b) => a.rating - b.rating);

    return fbs;
  }, [feedbacks, filters, teacherClassIds]);

  const paginated = useMemo(
    () => filtered.slice((page - 1) * pageSize, page * pageSize),
    [filtered, page]
  );

  const starDisplay = r => (
    <div className="flex">
      {[...Array(5)].map((_, i) =>
        i < +r ? (
          <FaStar key={i} className="text-yellow-400 mr-1" />
        ) : (
          <FaRegStar key={i} className="text-gray-300 mr-1" />
        )
      )}
    </div>
  );

  const getName = (arr, id, field) =>
    arr.find(x => x[Object.keys(x)[0]] === id)?.[field] || `#${id}`;

  return feedbacks.length === 0 ? (
    <LoadingSpinner />
  ) : (
    <div className="p-6 bg-blue-50 min-h-screen space-y-6">
      <h1 className="text-xl font-semibold">Feedback lớp tôi phụ trách</h1>

      {/* Bộ lọc */}
      <div className="flex flex-wrap gap-4 mb-6">
        <Select
          label="Khóa học"
          value={filters.course}
          onChange={e => {
            setFilters(f => ({ ...f, course: e.target.value }));
            setPage(1);
          }}
          options={[
            { value: "all", label: "Tất cả" },
            ...courses
              .filter(c => teacherCourseIds.includes(c.course_id)) // ✅ chỉ khóa học của thầy
              .map(c => ({ value: c.course_id, label: c.course_name }))
          ]}
          className="w-64"
        />
        <Select
          label="Số sao"
          value={filters.rating}
          onChange={e => {
            setFilters(f => ({ ...f, rating: e.target.value }));
            setPage(1);
          }}
          options={[
            { value: "all", label: "Tất cả" },
            ...[5, 4, 3, 2, 1].map(n => ({ value: n, label: `${n} sao` }))
          ]}
          className="w-40"
        />
        <Select
          label="Sắp xếp"
          value={filters.sort}
          onChange={e => {
            setFilters(f => ({ ...f, sort: e.target.value }));
            setPage(1);
          }}
          options={[
            { value: "default", label: "Mặc định" },
            { value: "positive", label: "Tích cực → Tiêu cực" },
            { value: "negative", label: "Tiêu cực → Tích cực" }
          ]}
          className="w-60"
        />
      </div>

      {/* Danh sách feedback */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {paginated.length ? (
          paginated.map(fb => (
            <Card key={fb.feedback_id}>
              <div className="flex justify-between mb-2">
                <span className="font-semibold">
                  {getName(users, fb.user_id, "full_name")}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(fb.created_at).toLocaleDateString()}
                </span>
              </div>
              {starDisplay(fb.rating)}
              <p className="text-gray-700">{fb.comment}</p>
              <p className="mt-2 text-sm text-gray-500">
                Lớp: {getName(classes, fb.class_id, "class_name")} | Khóa học:{" "}
                {getName(courses, fb.course_id, "course_name")}
              </p>
            </Card>
          ))
        ) : (
          <p className="text-gray-500 col-span-full">
            Không có feedback cho lớp bạn phụ trách.
          </p>
        )}
      </div>

      {/* Phân trang */}
      {Math.ceil(filtered.length / pageSize) > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: Math.ceil(filtered.length / pageSize) }, (_, i) => (
            <button
              key={i}
              className={`px-3 py-1 rounded-md ${
                page === i + 1 ? "bg-blue-600 text-white" : "bg-white border"
              }`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherFeedback;
