import React from 'react';

interface LipsIconProps {
  size?: number;
  className?: string;
  color?: string;
}

export const LipsIcon: React.FC<LipsIconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Upper lip */}
    <path d="M4 13 C4 13, 7 8, 9.5 10 C10.5 11, 11 11.5, 12 11.5 C13 11.5, 13.5 11, 14.5 10 C17 8, 20 13, 20 13" />
    {/* Lower lip */}
    <path d="M4 13 C4 13, 8 19, 12 19 C16 19, 20 13, 20 13" />
  </svg>
);
