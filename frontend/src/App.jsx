import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
// import AppRoutes from "./routes/AppRoutes";
import DashboardHeader from "./components/layout/DashboardHeader";
import Navbar from "./components/layout/Navbar";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex min-h-screen">
          <Navbar role="student" />

          <div className="flex-1 flex flex-col">
            <DashboardHeader />
            <main className="flex-1 p-6">
              {/* <AppRoutes /> */}
              <div className="text-gray-700">Nội dung dashboard ở đây</div>
            </main>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;