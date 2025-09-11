// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import logo from "../../assets/logo.png";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Login clicked");

    try {
      const res = await fetch("http://localhost:3001/users");
      const users = await res.json();

      const user = users.find(
        (u) => u.username === username && u.password === password
      );

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        setMessage("✅ Login thành công");
        console.log("User role:", user.role);

        //điều hướng theo role
        switch (user.role) {
          case "Học viên":
            navigate("/dashboard/student");
            break;
          case "Giảng viên":
            navigate("/dashboard/teacher");
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
      } else {
        setMessage(" Sai username hoặc password");
      }
    } catch (error) {
      console.error("API error:", error);
      setMessage(" Lỗi kết nối API");
    }
  };

  return (
    // w-full max-w-xl p-10 shadow-lg rounded-2xl
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md min-h-[500px] p-10 shadow-lg rounded-2xl flex flex-col justify-center">
        <div className="flex flex-col items-center mb-6">
          {/* Logo */}
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

           {/* Button căn giữa */}
          <div className="flex justify-center mt-4">
            <Button type="submit" variant="primary" className="px-8">
              Đăng nhập
            </Button>
          </div>
        </form>

        {message && (
          <p className="text-center mt-3 text-sm font-medium text-red-500">
            {message}
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
