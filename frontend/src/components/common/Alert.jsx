import React from "react";

const Alert = ({ message, type = "info", onClose }) => {
  const colors = {
    info: "bg-blue-100 text-blue-800",
    success: "bg-green-100 text-green-800",
    error: "bg-red-100 text-red-800",
    warning: "bg-yellow-100 text-yellow-800",
  };
  return (
    <div className={`p-4 rounded ${colors[type]} flex justify-between items-center mb-2`}>
      <span>{message}</span>
      {onClose && <button onClick={onClose} className="ml-4 font-bold">x</button>}
    </div>
  );
};

export default Alert;