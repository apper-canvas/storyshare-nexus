import React from "react";
import ApperIcon from "@/components/ApperIcon";

const ErrorView = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-red-50 to-rose-50 rounded-lg">
      <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-rose-200 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name="AlertTriangle" size={32} className="text-red-600" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Oops! Something went wrong
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md">
        {message}
      </p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-gradient-to-r from-primary to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 active:scale-98 shadow-lg hover:shadow-xl"
        >
          <div className="flex items-center gap-2">
            <ApperIcon name="RotateCcw" size={16} />
            Try Again
          </div>
        </button>
      )}
    </div>
  );
};

export default ErrorView;