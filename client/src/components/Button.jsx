// src/components/Button.js
import React from 'react';

const Button = ({ children, onClick, className, onError, ...props }) => {
  const handleClick = (e) => {
    try {
      onClick?.(e);
    } catch (error) {
      onError?.(error);
    }
  };

  return (
    <button
      className={`${className} transition-colors duration-200`}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

