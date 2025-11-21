import React from "react";
import { cn } from "@/utils/cn";
import StoryCard from "@/components/molecules/StoryCard";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";

const StoryGrid = ({ 
  stories = [], 
  loading = false, 
  error = null,
  className,
  showActions = false,
  onStoryClick,
  onStoryEdit,
  onStoryDelete,
  onRetry,
  emptyTitle = "No stories found",
  emptyDescription = "Start exploring to discover amazing stories!",
  emptyActionLabel,
  onEmptyAction
}) => {
  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorView message={error} onRetry={onRetry} />;
  }

  if (!stories || stories.length === 0) {
    return (
      <Empty
        title={emptyTitle}
        description={emptyDescription}
        actionLabel={emptyActionLabel}
        onAction={onEmptyAction}
        icon="BookOpen"
      />
    );
  }

  return (
    <div className={cn(
      "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
      className
    )}>
      {stories.map((story, index) => (
        <StoryCard
          key={story.Id}
          story={story}
          onClick={onStoryClick}
          showActions={showActions}
          onEdit={onStoryEdit}
          onDelete={onStoryDelete}
          style={{
            animationDelay: `${index * 50}ms`
          }}
          className="animate-fade-in"
        />
      ))}
    </div>
  );
};

export default StoryGrid;