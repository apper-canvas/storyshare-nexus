import React from "react";

const Loading = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg w-64 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-96 animate-pulse"></div>
        </div>
        
        {/* Story Cards Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-card overflow-hidden animate-pulse"
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              {/* Cover Image Skeleton */}
              <div className="aspect-[3/4] bg-gradient-to-br from-slate-200 to-slate-300"></div>
              
              {/* Content Skeleton */}
              <div className="p-4 space-y-3">
                {/* Title */}
                <div className="h-5 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-full"></div>
                
                {/* Author */}
                <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-2/3"></div>
                
                {/* Genre Badge */}
                <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full w-20"></div>
                
                {/* Stats */}
                <div className="flex justify-between pt-2">
                  <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-16"></div>
                  <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;