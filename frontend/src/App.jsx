import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import TeacherOverview from "./pages/dashboard/teacher/TeacherOverview.jsx";
import TeacherClassList from "./pages/dashboard/teacher/TeacherClassList.jsx";
import TeacherClassStudents from "./pages/dashboard/teacher/TeacherClassStudents.jsx"; 
import TeacherEnterGrades from "./pages/dashboard/teacher/TeacherEnterGrades.jsx";
import TeacherAttendance from "./pages/dashboard/teacher/TeacherAttendance.jsx";
import TeacherAttendanceDetail from "./pages/dashboard/teacher/TeacherAttendanceDetail.jsx";
import TeacherAssignment from "./pages/dashboard/teacher/TeacherAssignment.jsx";
import TeacherAssignmentPage from "./pages/dashboard/teacher/TeacherAssignmentPage.jsx";
import DashboardLayout from "./components/layout/DashboardLayout";
import { useAuth } from "./contexts/AuthContext";
import "./App.css";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/dashboard/*"
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route path="teacher/overview" element={<TeacherOverview />} />
        <Route path="teacher/classes" element={<TeacherClassList />} />
        <Route path="teacher/class-students/:classId" element={<TeacherClassStudents />} /> 
        <Route path="teacher/enter-grades/:classId" element={<TeacherEnterGrades />} />
        <Route path="teacher/attendance" element={<TeacherAttendance />} />
        <Route path="teacher/attendance/:classId" element={<TeacherAttendanceDetail />} />
        <Route path="teacher/assignments" element={<TeacherAssignmentPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}