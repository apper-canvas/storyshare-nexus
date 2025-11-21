import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const NavigationItem = ({ 
  to, 
  icon, 
  children, 
  className,
  onClick,
  badge,
  ...props 
}) => {
  const baseStyles = "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium text-sm relative group hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10";
  const activeStyles = "bg-gradient-to-r from-primary to-secondary text-white shadow-lg";
  const inactiveStyles = "text-gray-700 hover:text-primary";

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={cn(baseStyles, inactiveStyles, className)}
        {...props}
      >
        <ApperIcon name={icon} size={20} />
        <span className="flex-1 text-left">{children}</span>
        {badge && (
          <span className="bg-accent text-white text-xs px-2 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </button>
    );
  }

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          baseStyles,
          isActive ? activeStyles : inactiveStyles,
          className
        )
      }
      {...props}
    >
      <ApperIcon name={icon} size={20} />
      <span className="flex-1">{children}</span>
      {badge && (
        <span className="bg-accent text-white text-xs px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </NavLink>
  );
};

export default NavigationItem;