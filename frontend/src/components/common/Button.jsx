import React from "react";

const Button = ({ children, onClick, type = "button", variant = "primary", disabled = false }) => {
  const base = "px-4 py-2 rounded-md font-semibold transition-colors duration-200";

  const primary = "bg-blue-500 text-white hover:bg-blue-700 focus:ring-blue-500";
  const secondary = "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400";
  const danger = "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500";

  const variantClass = {
    primary,
    secondary,
    danger,
  }[variant];

  const disabledClass = disabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${base} ${variantClass} ${disabledClass}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
