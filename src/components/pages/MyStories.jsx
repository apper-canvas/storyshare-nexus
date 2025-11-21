import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import StoryGrid from "@/components/organisms/StoryGrid";
import CreateStoryModal from "@/components/organisms/CreateStoryModal";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { storyService } from "@/services/api/storyService";

const MyStories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    loadMyStories();
  }, []);

  const loadMyStories = async () => {
    setLoading(true);
    setError("");
    
    try {
      const allStories = await storyService.getAll();
      // Filter stories for current user (for demo, showing all)
      setStories(allStories);
    } catch (err) {
      setError("Failed to load your stories. Please try again.");
      console.error("Error loading my stories:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStory = async (storyData) => {
    try {
      const newStory = await storyService.create({
        ...storyData,
        authorName: "Current User", // In real app, this would come from auth
        status: "draft",
        chapterCount: 0,
        views: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      setStories(prev => [newStory, ...prev]);
      toast.success("Story created successfully!");
    } catch (error) {
      console.error("Error creating story:", error);
      toast.error("Failed to create story. Please try again.");
      throw error;
    }
  };

  const handleEditStory = (story) => {
    console.log("Editing story:", story);
    toast.info(`Editing "${story.title}" - Feature coming soon!`);
  };

  const handleDeleteStory = async (story) => {
    if (!confirm(`Are you sure you want to delete "${story.title}"?`)) {
      return;
    }

    try {
      await storyService.delete(story.Id);
      setStories(prev => prev.filter(s => s.Id !== story.Id));
      toast.success("Story deleted successfully!");
    } catch (error) {
      console.error("Error deleting story:", error);
      toast.error("Failed to delete story. Please try again.");
    }
  };

  const handleRetry = () => {
    loadMyStories();
  };

  const getStoryStats = () => {
    const published = stories.filter(s => s.status === "published").length;
    const drafts = stories.filter(s => s.status === "draft").length;
    const totalViews = stories.reduce((sum, story) => sum + (story.views || 0), 0);

    return { published, drafts, totalViews };
  };

  const stats = getStoryStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Stories</h1>
            <p className="text-gray-600">
              Manage your stories, track performance, and continue writing your next masterpiece.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              icon="Plus"
              onClick={() => setIsCreateModalOpen(true)}
              size="lg"
              className="shadow-xl"
            >
              Create New Story
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-card border border-white/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Published Stories</p>
                <p className="text-2xl font-bold text-gray-900">{stats.published}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="CheckCircle" size={20} className="text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-card border border-white/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Draft Stories</p>
                <p className="text-2xl font-bold text-gray-900">{stats.drafts}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="Edit3" size={20} className="text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-card border border-white/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="Eye" size={20} className="text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Stories Grid */}
        <div className="bg-white/80 backdrop-blur-lg rounded-xl p-8 shadow-card border border-white/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Your Stories</h2>
            <div className="flex items-center gap-2">
              <Badge variant="primary" size="sm">{stories.length} total</Badge>
            </div>
          </div>

          <StoryGrid
            stories={stories}
            loading={loading}
            error={error}
            onRetry={handleRetry}
            showActions={true}
            onStoryEdit={handleEditStory}
            onStoryDelete={handleDeleteStory}
            emptyTitle="No stories yet"
            emptyDescription="Create your first story and start sharing your imagination with the world!"
            emptyActionLabel="Create Your First Story"
            onEmptyAction={() => setIsCreateModalOpen(true)}
          />
        </div>

        {/* Writing Tips */}
        <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-accent to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <ApperIcon name="Lightbulb" size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Writing Tip</h3>
              <p className="text-gray-700 text-sm">
                Start with a compelling first chapter to hook your readers. Don't worry about making it perfect – 
                you can always edit later. The most important thing is to begin writing!
              </p>
            </div>
          </div>
        </div>

        {/* Create Story Modal */}
        <CreateStoryModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateStory}
        />
      </div>
    </div>
  );
};

export default MyStories;