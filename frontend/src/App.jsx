import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import DashboardLayout from "./components/layout/DashboardLayout";
import { useAuth } from "./contexts/AuthContext";
import "./App.css";

import StudentOverview from "./pages/dashboard/student/StudentOverview.jsx";
import StudentSchedulePage from "./pages/dashboard/student/StudentSchedule.jsx";
import StudentGradesPage from "./pages/dashboard/student/StudentGrades.jsx";
import StudentMaterials from "./pages/dashboard/student/StudentMaterials.jsx";
import AllVocabPage from "./pages/dashboard/student/AllVocabPage.jsx";
import StudentFeedback from "./pages/dashboard/student/StudentFeedback.jsx";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route path="/dashboard/*" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
        <Route path="student/overview" element={<StudentOverview />} />
        <Route path="student/schedule" element={<StudentSchedulePage />} />
        <Route path="student/grades" element={<StudentGradesPage />} />
        <Route path="student/materials" element={<StudentMaterials />} />
        <Route path="student/flashcards/:materialId" element={<AllVocabPage />} />
        <Route path="student/feedback" element={<StudentFeedback />} />
      </Route>


      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
