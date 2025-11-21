import React from "react";
import { cn } from "@/utils/cn";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ 
  onMenuToggle, 
  searchValue, 
  onSearchChange, 
  onSearch,
  className 
}) => {
  return (
    <header className={cn(
      "bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-30",
      className
    )}>
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        >
          <ApperIcon name="Menu" size={20} className="text-gray-700" />
        </button>

        {/* Logo (Mobile) */}
        <div className="flex lg:hidden items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-primary to-secondary rounded-md flex items-center justify-center">
            <ApperIcon name="BookOpen" size={16} className="text-white" />
          </div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            StoryShare
          </h1>
        </div>

        {/* Search Bar */}
        <div className="hidden sm:flex flex-1 justify-center max-w-2xl mx-4">
          <SearchBar
            value={searchValue}
            onChange={onSearchChange}
            onSearch={onSearch}
            placeholder="Search stories, authors, genres..."
            className="w-full"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Mobile Search Button */}
          <button className="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
            <ApperIcon name="Search" size={18} className="text-gray-700" />
          </button>

          {/* Notifications */}
          <button className="hidden sm:flex p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 relative">
            <ApperIcon name="Bell" size={18} className="text-gray-700" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:block w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
              <ApperIcon name="User" size={16} className="text-white" />
            </div>
            <button className="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <ApperIcon name="User" size={18} className="text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="sm:hidden px-4 pb-4">
        <SearchBar
          value={searchValue}
          onChange={onSearchChange}
          onSearch={onSearch}
          placeholder="Search stories..."
        />
      </div>
    </header>
  );
};

export default Header;