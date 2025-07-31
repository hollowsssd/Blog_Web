import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800 ${className}`}
    >
      {children}
    </span>
  );
}
