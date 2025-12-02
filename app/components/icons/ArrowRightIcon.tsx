import React from "react";

interface ArrowRightIconProps {
  className?: string;
}

export const ArrowRightIcon: React.FC<ArrowRightIconProps> = ({
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
    <path d="M9 6l6 6-6 6" />
  </svg>
);
