import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "Nothing here yet", 
  description = "Start exploring to discover amazing content!",
  actionLabel,
  onAction,
  icon = "BookOpen"
}) => {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-slate-50 to-indigo-50 rounded-lg">
      <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-200 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} size={40} className="text-indigo-600" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md">
        {description}
      </p>
      
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-lg hover:from-secondary hover:to-accent transition-all duration-200 transform hover:scale-105 active:scale-98 shadow-lg hover:shadow-xl"
        >
          <div className="flex items-center gap-2">
            <ApperIcon name="Plus" size={16} />
            {actionLabel}
          </div>
        </button>
      )}
    </div>
  );
};

export default Empty;