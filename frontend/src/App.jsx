import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import StudentDashboard from "./pages/dashboard/student/StudentOverview.jsx";
import StudentSchedulePage from "./pages/dashboard/student/StudentSchedule.jsx";
import StudentGradesPage from "./pages/dashboard/student/StudentGrades.jsx";

import AdminEmployees from "./pages/dashboard/admin/AdminEmployees.jsx";
import AdminOverview from "./pages/dashboard/admin/AdminOverview.jsx";
import AdminFeedback from "./pages/dashboard/admin/AdminFeedback.jsx";


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

      <Route path="/dashboard/*" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
        <Route path="student/overview" element={<StudentDashboard />} />
        <Route path="student/schedule" element={<StudentSchedulePage />} />
        <Route path="student/grades" element={<StudentGradesPage />} />

        <Route path="admin/employees" element={<AdminEmployees />} />
        <Route path="admin/overview" element={<AdminOverview />} />
        <Route path="admin/feedback" element={<AdminFeedback />} />


      </Route>


      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}