import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 1. Tạo Context
const AuthContext = createContext();

// 2. Provider
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null); // hoặc dữ liệu user từ API
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    navigate('/dashboard');
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    navigate('/auth/login');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Hook tiện lợi
export const useAuth = () => useContext(AuthContext);