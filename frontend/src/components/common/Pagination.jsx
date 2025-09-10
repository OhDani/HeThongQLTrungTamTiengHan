import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className="flex space-x-2 mt-4">
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`px-3 py-1 rounded ${p === currentPage ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          {p}
        </button>
      ))}
    </div>
  );
};

export default Pagination;