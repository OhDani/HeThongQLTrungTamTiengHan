// src/pages/auth/LoginPage.jsx
import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import logo from "../../assets/logo.png";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const foundUser = await login(username, password);

    if (foundUser) {
      switch (foundUser.role) {
        case "Học viên":
          navigate("/dashboard/student");
          break;
        case "Giảng viên":
          navigate("/dashboard/teacher/overview");
          break;
        case "Quản lý học vụ":
          navigate("/dashboard/manager");
          break;
        case "Quản lý hệ thống":
          navigate("/dashboard/admin");
          break;
        default:
          navigate("/login");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md min-h-[500px] p-10 shadow-lg rounded-2xl flex flex-col justify-center">
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="Logo" className="h-16 mb-2" />
          <h2 className="text-2xl font-bold">Đăng nhập</h2>
        </div>

        <form onSubmit={handleLogin}>
          <Input
            id="username"
            label="Tên đăng nhập hoặc Email"
            placeholder="Nhập tên đăng nhập hoặc email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <Input
            id="password"
            type="password"
            label="Mật khẩu"
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex justify-center mt-4">
            <Button
              type="submit"
              variant="primary"
              className="px-8"
              disabled={loading}
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </div>
        </form>

        {error && (
          <p className="text-center mt-3 text-sm font-medium text-red-500">
            {error}
          </p>
        )}

        <div className="text-center mt-4 text-sm text-gray-600">
          <a
            href="/forgot-password"
            className="text-blue-600 hover:underline mt-2 block"
          >
            Quên mật khẩu?
          </a>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
