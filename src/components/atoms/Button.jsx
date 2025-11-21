import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Button = forwardRef(({ 
  children, 
  className, 
  variant = "primary", 
  size = "md", 
  icon,
  iconPosition = "left",
  loading = false,
  disabled = false,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-98 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl focus:ring-primary",
    secondary: "bg-gradient-to-r from-secondary to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 shadow-lg hover:shadow-xl focus:ring-secondary",
    accent: "bg-gradient-to-r from-accent to-pink-600 text-white hover:from-pink-600 hover:to-pink-700 shadow-lg hover:shadow-xl focus:ring-accent",
    outline: "border-2 border-primary text-primary bg-white hover:bg-primary hover:text-white focus:ring-primary",
    ghost: "text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-300",
    danger: "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl focus:ring-red-500"
  };
  
  const sizes = {
    sm: "px-3 py-2 text-sm gap-1",
    md: "px-4 py-2.5 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2",
    xl: "px-8 py-4 text-lg gap-3"
  };

  return (
    <button
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <ApperIcon name="Loader2" size={size === "sm" ? 14 : size === "lg" ? 18 : size === "xl" ? 20 : 16} className="animate-spin" />
      )}
      
      {!loading && icon && iconPosition === "left" && (
        <ApperIcon name={icon} size={size === "sm" ? 14 : size === "lg" ? 18 : size === "xl" ? 20 : 16} />
      )}
      
      {children}
      
      {!loading && icon && iconPosition === "right" && (
        <ApperIcon name={icon} size={size === "sm" ? 14 : size === "lg" ? 18 : size === "xl" ? 20 : 16} />
      )}
    </button>
  );
});

Button.displayName = "Button";

export default Button;