import React from "react";

interface ArrowLeftIconProps {
  className?: string;
}

export const ArrowLeftIcon: React.FC<ArrowLeftIconProps> = ({
  className = "",
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M15 18l-6-6 6-6" />
  </svg>
);
