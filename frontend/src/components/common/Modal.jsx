import React from "react";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  className = "",
  backdropClassName = "",
}) => {
  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 flex justify-center items-center ${backdropClassName}`}
      onClick={onClose} // click vào background để đóng
    >
      <div
        className={`bg-white p-6 rounded-md shadow-lg ${className}`}
        onClick={(e) => e.stopPropagation()} // ngăn click vào modal đóng
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 font-bold text-2xl transition-colors"
          >
            ×
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
