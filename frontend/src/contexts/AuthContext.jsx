// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState } from "react";
import { userApi } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Hàm login chỉ xử lý state + trả về user
  const login = async (username, password) => {
    try {
      setLoading(true);
      setError(null);

      const users = await userApi.getAll();

      const foundUser = users.find(
        (u) => u.username === username && u.password === password
      );

      if (foundUser) {
        setUser(foundUser);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(foundUser));
        return foundUser; // trả về user cho LoginPage xử lý
      } else {
        setError("Sai tài khoản hoặc mật khẩu");
        return null;
      }
    } catch (err) {
      setError("Lỗi kết nối tới server");
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Hàm logout
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, error, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
