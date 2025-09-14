import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { getStudentOverview } from "../../../services/studentService"; 
import { classApi, enrollmentApi } from "../../../services/api";
import Card from "../../../components/common/Card";
import { Link } from "react-router-dom";
import avt from "../../../assets/gaisosinh.png";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend);

const StudentOverview = ({ studentId = 1 }) => {
  const [studentInfo, setStudentInfo] = useState(null);
  const [studentGrade, setStudentGrade] = useState(null);
  const [value, setValue] = useState(new Date());
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { studentInfo, latestGrade } = await getStudentOverview(studentId);
      setStudentInfo(studentInfo);
      setStudentGrade(latestGrade);
    };
    fetchData();
  }, [studentId]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const enrollments = await enrollmentApi.getAll();
        const myEnrollments = enrollments.filter((en) => en.studentId === studentId);
        const classes = await classApi.getAll();
        const myClasses = classes.filter((cls) =>
          myEnrollments.some((en) => en.classId === cls.id)
        );

        const mappedEvents = myClasses.flatMap((cls) =>
          cls.schedule.map((s) => ({
            date: s.date,
            type: s.type || "class",
            title: cls.class_name,
            room: cls.room,
            teacher: cls.teacher_id,
          }))
        );

        setEvents(mappedEvents);
      } catch (err) {
        console.error("Lỗi fetch lịch học:", err);
      }
    };
    fetchEvents();
  }, [studentId]);

  if (!studentInfo || !studentGrade) return <p className="p-6">Đang tải dữ liệu...</p>;

  const actions = [
    { label: "Lịch học", color: "red-500", to: "/dashboard/student/schedule" },
    { label: "Điểm số", color: "blue-500", to: "/dashboard/student/grades" },
    { label: "Bài tập", color: "green-500", to: "/dashboard/student/assignments" },
    { label: "Tài liệu", color: "yellow-500", to: "/dashboard/student/materials" },
  ];

  const labels = ["Listening", "Speaking", "Reading", "Writing"];
  const data = {
    labels,
    datasets: [
      {
        label: "Điểm (%)",
        data: [
          studentGrade.final_listening,
          studentGrade.final_speaking,
          studentGrade.final_reading,
          studentGrade.final_writing,
        ],
        backgroundColor: "rgba(79, 70, 229, 0.6)",
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Kết quả học tập" },
      tooltip: { enabled: true },
    },
    scales: {
      y: { min: 0, max: 100, ticks: { stepSize: 10 } },
      x: { ticks: { maxRotation: 45, minRotation: 30 } },
    },
  };

  const getEventByDate = (date) =>
    events.find((e) => e.date === date.toISOString().split("T")[0]);

  return (
    <div className="p-6 bg-blue-50 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cột trái */}
        <Card className="lg:col-span-2 bg-white shadow-md rounded-2xl p-6 flex flex-col gap-6">
          {/* Hero section */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold uppercase">
                Hi, {studentInfo.full_name}!
              </h2>
              <p className="text-gray-600 mt-2">Hôm nay bạn sẽ làm gì?</p>
              <div className="flex gap-3 mt-4 text-sm">
                {actions.map((action) => (
                  <Link
                    key={action.label}
                    to={action.to}
                    className="flex items-center gap-1 hover:underline"
                  >
                    <span className={`w-3 h-3 bg-${action.color} rounded-full`} />
                    {action.label}
                  </Link>
                ))}
              </div>
            </div>
            <img src={avt} alt="student" className="w-28 h-28" />
          </div>

          {/* Stats & chart */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-50 shadow rounded-xl p-6 text-center">
              <p className="text-3xl font-bold text-purple-600">
                {studentGrade.rank ?? "-"} / {studentGrade.total_students ?? "-"}
              </p>
              <p className="text-gray-600">Xếp hạng</p>
            </div>
            <div className="bg-green-50 shadow rounded-xl p-6 text-center">
              <p className="text-3xl font-bold text-green-600">
                {studentGrade.attendance_days ?? "-"} / {studentGrade.total_days ?? "-"}
              </p>
              <p className="text-gray-600">Số buổi học</p>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-xl p-6 h-[400px]">
            <Bar data={data} options={options} />
          </div>
        </Card>

        {/* Cột phải */}
        <Card className="bg-white shadow-md rounded-xl p-6">
          <h3 className="font-bold mb-4">📅 Lịch</h3>
          <Calendar
            onChange={setValue}
            value={value}
            className="rounded-xl overflow-hidden"
            tileClassName={({ date }) => {
              const ev = getEventByDate(date);

              if (date.toDateString() === new Date().toDateString())
                return "bg-blue-100 rounded-lg font-bold";

              if (ev?.type === "exam") return "text-red-600 font-semibold";

              if (ev?.type === "class") return "text-green-600 font-semibold";

              return "";
            }}
          />
        </Card>
      </div>
    </div>
  );
};

export default StudentOverview;
