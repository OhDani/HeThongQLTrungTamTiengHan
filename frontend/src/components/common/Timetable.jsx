import React, { useState } from "react";
import Card from "./Card";
import Table from "./Table";

const days = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

// Thời gian các tiết
const periods = [
    { start: "07:00", end: "08:30" },
    { start: "08:30", end: "10:00" },
    { start: "10:00", end: "11:30" },
    { start: "13:00", end: "14:30" },
    { start: "14:30", end: "16:00" },
    { start: "16:00", end: "17:30" },
    { start: "18:00", end: "19:30" },
    { start: "19:30", end: "21:00" },
    { start: "21:00", end: "22:30" },
];

// Hàm parse schedule: { days: ["T2","T4"], time: "18:00-20:00" }
const parseSchedule = (schedule) => {
    if (!schedule) return { days: [], time: "" };
    const [dayPart, timePart] = schedule.split(",");
    return {
        days: dayPart.split("-").map((d) => d.trim()),
        time: timePart?.trim() || "",
    };
};

// Kiểm tra lớp thuộc tiết nào
const mapToPeriod = (classTime, period) => {
    if (!classTime) return false;
    const [start, end] = classTime.split("-");
    return !(end <= period.start || start >= period.end); // có giao nhau
};

const Timetable = ({ classes, courseMap }) => {
    const [weekOffset, setWeekOffset] = useState(0);

    // Lấy ngày đầu tuần (thứ 2)
    const getWeekDates = () => {
        const today = new Date();
        const firstDayOfWeek = new Date(today);
        firstDayOfWeek.setDate(today.getDate() - today.getDay() + 1 + weekOffset * 7);

        return days.map((_, idx) => {
            const d = new Date(firstDayOfWeek);
            d.setDate(firstDayOfWeek.getDate() + idx);
            return d;
        });
    };

    const weekDates = getWeekDates();

    // Cột cho Table
    const columns = [
        {
            key: "period",
            label: "Tiết",
            render: (_, idx) => (
                <div className="font-medium text-gray-600">
                    Tiết {idx + 1}
                    <div className="text-xs text-gray-400">
                        {periods[idx].start} - {periods[idx].end}
                    </div>
                </div>
            ),
        },
        ...days.map((day, idx) => ({
            key: day,
            label: (
                <div className="flex flex-col items-center">
                    <span>{day}</span>
                    <span className="text-xs text-gray-400">
                        {weekDates[idx].toLocaleDateString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                        })}
                    </span>
                </div>
            ),
            render: (_, periodIdx) => {
                const period = periods[periodIdx];
                const cl = classes.find((c) => {
                    const { days: clsDays, time } = parseSchedule(c.schedule);
                    return clsDays.includes(day) && mapToPeriod(time, period);
                });

                if (!cl) return <div></div>;

                const { time } = parseSchedule(cl.schedule);

                return (
                    <div className="bg-indigo-50 border border-indigo-200 rounded shadow-sm p-1 text-[10px] text-gray-700 hover:shadow transition-all">
                        <p className="font-semibold text-[11px]">{cl.class_name}</p>
                        <p>{courseMap[cl.course_id]?.course_name}</p>
                        <p className="text-gray-500">{cl.room}</p>
                        <p className="text-gray-400 text-[11px]">{time}</p>
                    </div>
                );

            },
        })),
    ];

    const data = Array.from({ length: periods.length }, (_, idx) => ({
        period: idx + 1,
    }));

    return (
        <Card className="p-6 shadow rounded bg-white">
            <h2 className="text-lg font-semibold">| Thời khóa biểu</h2>
            <div className="mb-4 flex flex-col items-center gap-2">

                <div className="flex items-center gap-3 text-sm">
                    <button
                        onClick={() => setWeekOffset((w) => w - 1)}
                        className="px- py-1 "
                    >
                        {"<< Tuần trước"}
                    </button>
                    <span className="font-medium">Tuần {weekOffset + 1}</span>
                    <button
                        onClick={() => setWeekOffset((w) => w + 1)}
                        className="px-2 py-1 "
                    >
                        {"Tuần sau >>"}
                    </button>
                </div>
            </div>

            <Table columns={columns} data={data} />
        </Card>
    );

};

export default Timetable;
