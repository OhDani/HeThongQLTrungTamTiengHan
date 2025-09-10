import React, { useEffect } from "react";

const Toast = ({ message, type = "info", duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const colors = {
    info: "bg-blue-500",
    success: "bg-green-500",
    error: "bg-red-500",
  };

  return (
    <div className={`fixed top-4 right-4 text-white px-4 py-2 rounded shadow-md ${colors[type]}`}>
      {message}
    </div>
  );
};

export default Toast;