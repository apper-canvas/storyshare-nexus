import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-card-hover border border-white/50">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <ApperIcon name="BookX" size={48} className="text-white" />
            </div>
            <div className="text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
              404
            </div>
          </div>

          {/* Content */}
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Page Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            Sorry, the page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={handleGoHome}
              icon="Home"
              className="flex-1 shadow-lg"
            >
              Go Home
            </Button>
            <Button 
              onClick={handleGoBack}
              variant="ghost"
              icon="ArrowLeft"
              className="flex-1"
            >
              Go Back
            </Button>
          </div>

          {/* Help Links */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">
              Looking for something specific?
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <button 
                onClick={() => navigate("/browse")}
                className="text-primary hover:text-secondary transition-colors duration-200"
              >
                Browse Stories
              </button>
              <button 
                onClick={() => navigate("/my-stories")}
                className="text-primary hover:text-secondary transition-colors duration-200"
              >
                My Stories
              </button>
              <button 
                onClick={() => navigate("/library")}
                className="text-primary hover:text-secondary transition-colors duration-200"
              >
                My Library
              </button>
            </div>
          </div>
        </div>

        {/* Additional Help */}
        <div className="mt-6 text-sm text-gray-500">
          <p>
            Need help? Contact our support team or check our{" "}
            <span className="text-primary hover:text-secondary cursor-pointer transition-colors duration-200">
              help center
            </span>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;