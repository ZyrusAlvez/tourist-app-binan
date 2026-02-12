"use client";

import React from "react";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
};

const TextButton = ({ children, onClick, className }: Props) => {
  return (
    <button
      onClick={onClick}
      className={`text-white transition-all duration-300 cursor-pointer moon-dance text-3xl font-bold ${className}`}
      onMouseEnter={(e) =>
        (e.currentTarget.style.textShadow =
          "0 0 8px #F76734, 0 0 16px #F76734, 0 0 24px #40B045")
      }
      onMouseLeave={(e) => (e.currentTarget.style.textShadow = "none")}
    >
      {children}
    </button>
  );
};

export default TextButton;