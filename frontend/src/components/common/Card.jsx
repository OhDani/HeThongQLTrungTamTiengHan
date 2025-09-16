import React from "react";

const Card = ({ children, className = "", onClick }) => {
  return (
    <div
      className={`rounded-lg shadow-md bg-white ${className}`}
      onClick={onClick} 
      role="button"
      tabIndex={0}
    >
      {children}
    </div>
  );
};

export default Card;