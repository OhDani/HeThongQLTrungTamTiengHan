// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { userApi } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initializing, setInitializing] = useState(true); 

  // Khôi phục user từ localStorage khi app khởi động
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          setIsAuthenticated(true);
          console.log("Restored user from localStorage:", userData);
        }
      } catch (error) {
        console.error("Error restoring user from localStorage:", error);
        // Clear corrupted data
        localStorage.removeItem("user");
      } finally {
        setInitializing(false);
      }
    };

    initializeAuth();
  }, []);

  // Hàm login chỉ xử lý state + trả về user
  const login = async (username, password) => {
    try {
      setLoading(true);
      setError(null);

      const users = await userApi.getAll();
      console.log("All users:", users); 

      const foundUser = users.find(
        (u) => u.username === username && u.password === password
      );

      if (foundUser) {
        setUser(foundUser);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(foundUser));
        console.log("Logged in user:", foundUser); 
        return foundUser; 
      } else {
        setError("Sai tài khoản hoặc mật khẩu");
        return null;
      }
    } catch (err) {
      setError("Lỗi kết nối tới server");
      console.error("Login error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    console.log("User logged out");
  };

  // Hiển thị loading khi đang khôi phục thông tin user
  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang khởi tạo ứng dụng...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{ 
        user, 
        isAuthenticated, 
        loading, 
        error, 
        login, 
        logout,
        initializing 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};