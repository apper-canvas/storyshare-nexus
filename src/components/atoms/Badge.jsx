import React from "react";
import { cn } from "@/utils/cn";

const Badge = ({ 
  children, 
  className, 
  variant = "primary", 
  size = "sm",
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-full whitespace-nowrap";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-blue-600 text-white",
    secondary: "bg-gradient-to-r from-secondary to-purple-600 text-white",
    accent: "bg-gradient-to-r from-accent to-pink-600 text-white",
    success: "bg-gradient-to-r from-success to-green-600 text-white",
    warning: "bg-gradient-to-r from-warning to-orange-600 text-white",
    error: "bg-gradient-to-r from-error to-red-600 text-white",
    outline: "border border-gray-300 text-gray-700 bg-white",
    ghost: "text-gray-700 bg-gray-100"
  };
  
  const sizes = {
    xs: "px-2 py-0.5 text-xs",
    sm: "px-2.5 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-sm"
  };

  return (
    <span
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;