import React from "react";

interface ZoomOutIconProps {
  className?: string;
}

export const ZoomOutIcon: React.FC<ZoomOutIconProps> = ({ className = "" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round">
    <circle cx="11" cy="11" r="7" />
    <line x1="8" y1="11" x2="14" y2="11" />
    <line x1="16.65" y1="16.65" x2="21" y2="21" />
  </svg>
);
