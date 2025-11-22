import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import StoryGrid from "@/components/organisms/StoryGrid";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import storyService from "@/services/api/storyService";

const Library = () => {
  const [savedStories, setSavedStories] = useState([]);
  const [readingHistory, setReadingHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("saved");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadLibraryData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [bookmarks, history] = await Promise.all([
        storyService.getUserBookmarks(),
        storyService.getReadingHistory()
      ]);

      setSavedStories(bookmarks);
      setReadingHistory(history);
    } catch (err) {
      setError("Failed to load your library. Please try again.");
      console.error("Error loading library data:", err);
    } finally {
      setLoading(false);
    }
};

  useEffect(() => {
    loadLibraryData();
  }, []);

  const handleRetry = () => {
    loadLibraryData();
  };

  const handleRemoveFromSaved = async (storyId) => {
    try {
      await storyService.unbookmark(storyId);
      setSavedStories(prev => prev.filter(story => story.Id !== storyId));
      toast.success("Story removed from bookmarks.");
    } catch (error) {
      toast.error("Failed to remove bookmark. Please try again.");
    }
  };

  const handleClearHistory = () => {
    if (confirm("Are you sure you want to clear your reading history?")) {
      setReadingHistory([]);
      toast.info("Reading history cleared.");
    }
  };

  const tabs = [
    { id: "saved", label: "Saved Stories", icon: "BookMarked", count: savedStories.length },
    { id: "history", label: "Reading History", icon: "Clock", count: readingHistory.length }
  ];

  const currentStories = activeTab === "saved" ? savedStories : readingHistory;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Library</h1>
          <p className="text-gray-600">
            Keep track of your favorite stories and reading progress.
          </p>
        </div>

        {/* Library Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-card border border-white/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Saved Stories</p>
                <p className="text-2xl font-bold text-gray-900">{savedStories.length}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="BookMarked" size={20} className="text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-card border border-white/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Stories Read</p>
                <p className="text-2xl font-bold text-gray-900">{readingHistory.length}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="CheckCircle" size={20} className="text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-card border border-white/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Reading Streak</p>
                <p className="text-2xl font-bold text-gray-900">7 days</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-accent to-pink-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="Flame" size={20} className="text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-card border border-white/50 mb-8">
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? "text-primary border-b-2 border-primary bg-gradient-to-r from-primary/5 to-secondary/5"
                    : "text-gray-600 hover:text-primary hover:bg-gray-50"
                }`}
              >
                <ApperIcon name={tab.icon} size={18} />
                <span>{tab.label}</span>
                <Badge 
                  variant={activeTab === tab.id ? "primary" : "ghost"} 
                  size="xs"
                >
                  {tab.count}
                </Badge>
              </button>
            ))}
          </div>

          {/* Tab Actions */}
          <div className="p-4 bg-gradient-to-r from-slate-50 to-indigo-50 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {activeTab === "saved" 
                  ? "Stories you've bookmarked for later reading"
                  : "Your recent reading activity and completed stories"
                }
              </p>
              
              {activeTab === "history" && readingHistory.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  icon="Trash2"
                  onClick={handleClearHistory}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Clear History
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Stories Grid */}
        <StoryGrid
          stories={currentStories}
          loading={loading}
          error={error}
          onRetry={handleRetry}
          emptyTitle={
            activeTab === "saved" 
              ? "No saved stories" 
              : "No reading history"
          }
          emptyDescription={
            activeTab === "saved"
              ? "Start saving stories you want to read later by clicking the bookmark icon."
              : "Your reading history will appear here as you read stories."
          }
          emptyActionLabel="Browse Stories"
          emptyIcon={activeTab === "saved" ? "BookMarked" : "Clock"}
        />

        {/* Reading Progress Section */}
        {activeTab === "saved" && currentStories.length > 0 && (
          <div className="mt-12 bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-card border border-white/50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ApperIcon name="TrendingUp" size={20} />
              Reading Progress
            </h3>
            <div className="space-y-4">
              {currentStories.slice(0, 3).map((story, index) => (
                <div key={story.Id} className="flex items-center gap-4 p-4 bg-gradient-to-r from-slate-50 to-indigo-50 rounded-lg border border-slate-200">
                  <div className="w-12 h-16 bg-gradient-to-br from-indigo-100 to-purple-200 rounded flex items-center justify-center flex-shrink-0">
                    <ApperIcon name="BookOpen" size={20} className="text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{story.title}</h4>
                    <p className="text-sm text-gray-600">by {story.authorName}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.random() * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">
                        Chapter {Math.floor(Math.random() * (story.chapterCount || 5)) + 1}/{story.chapterCount || 5}
                      </span>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" icon="Play">
                    Continue
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        <div className="mt-12 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-accent to-pink-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Sparkles" size={16} className="text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Recommended for You</h3>
          </div>
          <p className="text-gray-700 mb-4">
            Based on your reading history, we think you might enjoy these genres:
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Fantasy</Badge>
            <Badge variant="accent">Romance</Badge>
            <Badge variant="primary">Adventure</Badge>
            <Badge variant="ghost">Mystery</Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Library;