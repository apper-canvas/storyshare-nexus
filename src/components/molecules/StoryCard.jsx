import React from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import { cn } from "@/utils/cn";

const StoryCard = ({ 
  story, 
  className,
  onClick,
  showActions = false,
  onEdit,
  onDelete,
  ...props 
}) => {
  const navigate = useNavigate();
const handleClick = () => {
    if (onClick) {
      onClick(story);
    } else {
      // Navigate to story reading page
      navigate(`/story/${story.Id}`);
    }
  };

const handleEdit = (e) => {
    e.stopPropagation();
    if (onEdit) onEdit(story);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) onDelete(story);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "published": return "success";
      case "draft": return "warning";
      case "archived": return "ghost";
      default: return "primary";
    }
  };

  return (
    <div
      className={cn(
        "bg-white rounded-lg shadow-card hover:shadow-card-hover transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden group",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {/* Cover Image */}
      <div className="aspect-[3/4] relative overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
        {story.coverImage ? (
          <img
            src={story.coverImage}
            alt={story.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-200">
            <ApperIcon name="BookOpen" size={48} className="text-indigo-400" />
          </div>
        )}
        
        {/* Status Badge */}
        {story.status && (
          <div className="absolute top-3 left-3">
            <Badge variant={getStatusColor(story.status)} size="xs">
              {story.status}
            </Badge>
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {onEdit && (
              <button
                onClick={handleEdit}
                className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-110"
              >
                <ApperIcon name="Edit2" size={14} className="text-gray-700" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={handleDelete}
                className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-110"
              >
                <ApperIcon name="Trash2" size={14} className="text-red-600" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 group-hover:text-primary transition-colors duration-200">
          {story.title}
        </h3>

        {/* Author */}
        <p className="text-sm text-gray-600 flex items-center gap-1">
          <ApperIcon name="User" size={14} />
          {story.authorName}
        </p>

        {/* Genre */}
        {story.genre && (
          <Badge variant="secondary" size="xs">
            {story.genre}
          </Badge>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <ApperIcon name="BookOpen" size={12} />
            <span>{story.chapterCount || 0} chapters</span>
          </div>
          <div className="flex items-center gap-1">
            <ApperIcon name="Eye" size={12} />
            <span>{story.views || 0} views</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryCard;