import React, { useState } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const SearchBar = ({ 
  value, 
  onChange, 
  onSearch,
  placeholder = "Search stories...", 
  className,
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);

const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch && value.trim()) {
      onSearch(value.trim());
    }
  };
  return (
    <form onSubmit={handleSubmit} className={cn("relative w-full max-w-md", className)}>
      <div className={cn(
        "relative flex items-center transition-all duration-200",
        isFocused && "transform scale-105"
      )}>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <ApperIcon 
            name="Search" 
            size={18} 
            className={cn(
              "transition-colors duration-200",
              isFocused ? "text-primary" : "text-gray-400"
            )} 
          />
        </div>
        <input
          type="text"
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm text-gray-900 placeholder-gray-500"
          {...props}
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange({ target: { value: "" } })}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <ApperIcon name="X" size={16} />
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;