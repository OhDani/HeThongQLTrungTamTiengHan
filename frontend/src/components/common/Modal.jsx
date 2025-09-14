import React from "react";

const Modal = ({ isOpen, onClose, title, children, noOverlay = false }) => {
  if (!isOpen) return null;

  // Wrapper cho modal
  const wrapperClass = noOverlay
    ? "absolute inset-0 flex justify-center items-start z-50 mt-10 pointer-events-none" // pointer-events-none để click phía dưới vẫn được, modal bên trong có pointer-events-auto
    : "fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50";

  const contentClass = noOverlay
    ? "bg-white p-6 rounded-md shadow pointer-events-auto max-w-3xl w-full mx-4"
    : "bg-white p-6 rounded-md w-96";

  return (
    <div className={wrapperClass}>
      <div className={contentClass}>
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
