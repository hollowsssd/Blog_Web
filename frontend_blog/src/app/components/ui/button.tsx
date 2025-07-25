import React from "react";
import { cn } from "@/app/lib/utils";

type Variant = "default" | "outline" | "ghost" | "destructive";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: Variant;
  size?: Size;
}

export function Button({
  className = "",
  isLoading = false,
  children,
  variant = "default",
  size = "md",
  ...props
}: ButtonProps) {
  const baseClass =
    "inline-flex items-center justify-center rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  const variants: Record<Variant, string> = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 text-gray-900 hover:bg-gray-100",
    ghost: "text-gray-700 hover:bg-gray-100",
    destructive: "bg-red-600 text-white hover:bg-red-700",
  };

  const sizes: Record<Size, string> = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
  };

  const finalClass = cn(baseClass, variants[variant], sizes[size], className);

  return (
    <button
      type="button"
      className={finalClass}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
}
