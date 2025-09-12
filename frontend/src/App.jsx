import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import StudentDashboard from "./pages/dashboard/student/StudentDashboard";
import './App.css'

// Bảo vệ route
const PrivateRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <Routes>
      {/* Trang login */}
      <Route path="/login" element={<LoginPage />} />

      {/* Dashboard Học viên */}
      <Route
        path="/dashboard/student"
        element={
          <PrivateRoute>
            <StudentDashboard />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
