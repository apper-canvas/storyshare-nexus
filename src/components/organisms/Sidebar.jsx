import React from "react";
import { cn } from "@/utils/cn";
import NavigationItem from "@/components/molecules/NavigationItem";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ className, isOpen, onClose }) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          // Desktop: Static sidebar
          "hidden lg:flex lg:w-64 lg:flex-col lg:bg-white lg:shadow-xl lg:border-r lg:border-gray-200",
          // Mobile: Overlay sidebar
          "lg:relative fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name="BookOpen" size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              StoryShare
            </h1>
          </div>
          
          {/* Mobile Close Button */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <ApperIcon name="X" size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <NavigationItem to="" icon="Home">
            Home
          </NavigationItem>
          <NavigationItem to="my-stories" icon="Edit3">
            My Stories
          </NavigationItem>
          <NavigationItem to="browse" icon="Search">
            Browse
          </NavigationItem>
          <NavigationItem to="library" icon="BookMarked">
            Library
          </NavigationItem>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-6 h-6 bg-gradient-to-br from-accent to-pink-600 rounded-full flex items-center justify-center">
                <ApperIcon name="Sparkles" size={12} className="text-white" />
              </div>
              <p className="font-medium text-sm text-gray-900">Write & Share</p>
            </div>
            <p className="text-xs text-gray-600 mb-3">
              Join thousands of writers sharing their stories with the world.
            </p>
            <button className="w-full px-3 py-2 bg-gradient-to-r from-primary to-secondary text-white text-sm font-medium rounded-md hover:from-secondary hover:to-accent transition-all duration-200 transform hover:scale-105">
              Start Writing
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;