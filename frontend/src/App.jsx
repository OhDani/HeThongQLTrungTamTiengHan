import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import TeacherOverview from "./pages/dashboard/teacher/TeacherOverview.jsx";
import TeacherClassList from "./pages/dashboard/teacher/TeacherClassList.jsx";
import TeacherClassStudents from "./pages/dashboard/teacher/TeacherClassStudents.jsx";
import TeacherEnterGrades from "./pages/dashboard/teacher/TeacherEnterGrades.jsx";
import TeacherAttendance from "./pages/dashboard/teacher/TeacherAttendance.jsx";
import TeacherAttendanceDetail from "./pages/dashboard/teacher/TeacherAttendanceDetail.jsx";
import TeacherAssignmentPage from "./pages/dashboard/teacher/TeacherAssignmentPage.jsx";
import TeacherAssignmentPageDetail from "./pages/dashboard/teacher/TeacherAssignmentPageDetail.jsx";
import TeacherSchedulePage from "./pages/dashboard/teacher/TeacherSchedulePage.jsx";
import TeacherFeedback from "./pages/dashboard/teacher/TeacherFeedback.jsx";
import TeacherNotifications from "./pages/dashboard/teacher/TeacherNotifications.jsx";
import DashboardLayout from "./components/layout/DashboardLayout";
import { useAuth } from "./contexts/AuthContext";
import "./App.css";

import AdminEmployees from "./pages/dashboard/admin/AdminEmployees.jsx";
import AdminOverview from "./pages/dashboard/admin/AdminOverview.jsx";
import AdminFeedback from "./pages/dashboard/admin/AdminFeedback.jsx";
import AdminNotification from "./pages/dashboard/admin/AdminNotification.jsx";

import StudentOverview from "./pages/dashboard/student/StudentOverview.jsx";
import StudentSchedulePage from "./pages/dashboard/student/StudentSchedule.jsx";
import StudentGradesPage from "./pages/dashboard/student/StudentGrades.jsx";
import StudentMaterials from "./pages/dashboard/student/StudentMaterials.jsx";
import AllVocabPage from "./pages/dashboard/student/AllVocabPage.jsx";
import StudentFeedback from "./pages/dashboard/student/StudentFeedback.jsx";
import UserProfile from "./pages/dashboard/shared/UserProfile.jsx";
import StudentAssignment from "./pages/dashboard/student/StudentAssignment.jsx";
import Chat from "./pages/dashboard/shared/Chat.jsx";

import ManagerStudent from "./pages/dashboard/manager/ManagerStudent.jsx";
import { SearchProvider } from "./contexts/SearchContext.jsx";


const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;

};

export default function App() {
  return (
    <SearchProvider>

      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/dashboard/*" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>

          <Route path="student/overview" element={<StudentOverview />} />
          <Route path="student/profile" element={<UserProfile />} />
          <Route path="student/schedule" element={<StudentSchedulePage />} />
          <Route path="student/grades" element={<StudentGradesPage />} />
          <Route path="student/materials" element={<StudentMaterials />} />
          <Route path="student/materials/flashcards/:materialId" element={<AllVocabPage />} />
          <Route path="student/assignments" element={<StudentAssignment />} />
          <Route path="student/feedback" element={<StudentFeedback />} />

          <Route path="admin/profile" element={<UserProfile />} />
          <Route path="admin/employees" element={<AdminEmployees />} />
          <Route path="admin/overview" element={<AdminOverview />} />
          <Route path="admin/feedback" element={<AdminFeedback />} />
          <Route path="admin/notification" element={<AdminNotification />} />

          <Route path="teacher/overview" element={<TeacherOverview />} />
          <Route path="teacher/profile" element={<UserProfile />} />
          <Route path="teacher/classes" element={<TeacherClassList />} />
          <Route path="teacher/class-students/:classId" element={<TeacherClassStudents />} />
          <Route path="teacher/enter-grades/:classId" element={<TeacherEnterGrades />} />
          <Route path="teacher/attendance" element={<TeacherAttendance />} />
          <Route path="teacher/attendance/:classId" element={<TeacherAttendanceDetail />} />
          <Route path="teacher/assignments" element={<TeacherAssignmentPage />} />
          <Route path="teacher/assignments/:materialId/detail" element={<TeacherAssignmentPageDetail />} />
          <Route path="teacher/schedule" element={<TeacherSchedulePage />} />
          <Route path="teacher/feedback" element={<TeacherFeedback />} />
          <Route path="teacher/notification" element={<TeacherNotifications />} />

          <Route path="manager/profile" element={<UserProfile />} />
          <Route path="manager/students" element={<ManagerStudent />} />

          <Route path="admin/messages" element={<Chat />} />
          <Route path="teacher/messages" element={<Chat />} />
          <Route path="student/messages" element={<Chat />} />
          <Route path="manager/messages" element={<Chat />} />

        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </SearchProvider>
  );
}