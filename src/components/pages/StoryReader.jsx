import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import ApperIcon from "@/components/ApperIcon";
import { storyService } from "@/services/api/storyService";

const StoryReader = () => {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    loadStory();
  }, [storyId]);

  const loadStory = async () => {
    setLoading(true);
    setError("");
    
    try {
      const storyData = await storyService.getById(storyId);
      setStory(storyData);
      
      // Mock reading progress and bookmark status
      setReadingProgress(Math.floor(Math.random() * 100));
      setIsBookmarked(Math.random() > 0.5);
    } catch (err) {
      setError(err.message || "Failed to load story.");
      console.error("Error loading story:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = async () => {
    try {
      if (isBookmarked) {
        await storyService.unbookmark(story.Id);
        setIsBookmarked(false);
        toast.success("Story removed from bookmarks.");
      } else {
        await storyService.bookmark(story.Id);
        setIsBookmarked(true);
        toast.success("Story bookmarked!");
      }
    } catch (error) {
      toast.error("Failed to update bookmark. Please try again.");
    }
  };

  const handleStartReading = () => {
    toast.info("Chapter reading feature coming soon!");
  };

  const handleContinueReading = () => {
    toast.info(`Continuing from chapter ${Math.floor(readingProgress / 20) + 1}...`);
  };

  if (loading) return <Loading />;
  if (error) return <ErrorView message={error} onRetry={loadStory} />;
  if (!story) return <ErrorView message="Story not found" />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors duration-200"
        >
          <ApperIcon name="ArrowLeft" size={20} />
          <span>Back</span>
        </button>

        <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-card border border-white/50 overflow-hidden">
          {/* Story Header */}
          <div className="md:flex gap-8 p-8">
            {/* Cover Image */}
            <div className="md:w-64 mb-6 md:mb-0">
              <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-200">
                {story.coverImage ? (
                  <img
                    src={story.coverImage}
                    alt={story.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ApperIcon name="BookOpen" size={64} className="text-indigo-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Story Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{story.title}</h1>
                  <p className="text-lg text-gray-600 flex items-center gap-2">
                    <ApperIcon name="User" size={18} />
                    by {story.authorName}
                  </p>
                </div>
                <button
                  onClick={handleBookmark}
                  className={`p-3 rounded-full transition-all duration-200 ${
                    isBookmarked
                      ? "bg-accent text-white hover:bg-accent/90"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <ApperIcon name={isBookmarked ? "BookMarked" : "Bookmark"} size={20} />
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="secondary">{story.genre}</Badge>
                <Badge variant={story.status === "published" ? "success" : "warning"}>
                  {story.status}
                </Badge>
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed">
                {story.description}
              </p>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-6 mb-6 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <ApperIcon name="BookOpen" size={16} />
                  <span>{story.chapterCount || 0} chapters</span>
                </div>
                <div className="flex items-center gap-1">
                  <ApperIcon name="Eye" size={16} />
                  <span>{story.views || 0} views</span>
                </div>
                <div className="flex items-center gap-1">
                  <ApperIcon name="Clock" size={16} />
                  <span>Updated {new Date(story.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Reading Progress */}
              {readingProgress > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Reading Progress</span>
                    <span className="text-sm text-gray-600">{readingProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-300"
                      style={{ width: `${readingProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                {readingProgress > 0 ? (
                  <Button size="lg" icon="Play" onClick={handleContinueReading}>
                    Continue Reading
                  </Button>
                ) : (
                  <Button size="lg" icon="BookOpen" onClick={handleStartReading}>
                    Start Reading
                  </Button>
                )}
                <Button variant="secondary" size="lg" icon="Share">
                  Share
                </Button>
              </div>
            </div>
          </div>

          {/* Story Content Preview */}
          <div className="border-t border-gray-200 p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">About this Story</h3>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed">
                {story.description}
              </p>
            </div>
            
            {/* Chapter List Preview */}
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Chapters</h4>
              <div className="space-y-3">
                {Array.from({ length: story.chapterCount || 5 }, (_, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-indigo-50 rounded-lg border border-slate-200 hover:shadow-sm transition-shadow duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900">
                          Chapter {index + 1}: {index === 0 ? "The Beginning" : `Chapter ${index + 1}`}
                        </h5>
                        <p className="text-sm text-gray-600">
                          {Math.floor(Math.random() * 3000) + 1000} words
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => toast.info(`Reading Chapter ${index + 1}...`)}
                    >
                      Read
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related Stories */}
        <div className="mt-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">More from {story.authorName}</h3>
          <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-card border border-white/50">
            <p className="text-gray-600 text-center py-8">
              Check out more stories by this author - feature coming soon!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryReader;