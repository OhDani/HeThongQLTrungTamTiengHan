import React from "react";

const Card = ({ children, className = "", onClick }) => {
  return (
    <div
      className={`p-4 rounded-lg shadow-md bg-white ${className}`}
      onClick={onClick} 
      role="button"
      tabIndex={0}
    >
      {children}
    </div>
  );
};

export default Card;