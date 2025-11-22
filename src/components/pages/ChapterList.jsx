import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import chapterService from "@/services/api/chapterService";
import storyService from "@/services/api/storyService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import CreateChapterModal from "@/components/organisms/CreateChapterModal";

const ChapterList = () => {
  const { storyId } = useParams();
  const navigate = useNavigate();
  
  const [story, setStory] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, [storyId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [storyData, chaptersData] = await Promise.all([
        storyService.getById(storyId),
        chapterService.getByStoryId(storyId)
      ]);
      
      setStory(storyData);
      setChapters(chaptersData);
    } catch (err) {
      console.error("Error loading data:", err);
      setError(err.message || "Failed to load story and chapters");
      toast.error("Failed to load story and chapters");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChapter = async (chapterData) => {
    try {
      const newChapter = await chapterService.create({
        ...chapterData,
        storyId: storyId
      });
      
      setChapters(prev => [...prev, newChapter].sort((a, b) => a.chapterNumber - b.chapterNumber));
      toast.success(`Chapter "${newChapter.title}" created successfully!`);
      
      // Update story chapter count
      if (story) {
        const updatedChapterCount = chapters.length + 1;
        await storyService.update(storyId, { chapterCount: updatedChapterCount });
        setStory(prev => ({ ...prev, chapterCount: updatedChapterCount }));
      }
      
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error("Error creating chapter:", err);
      toast.error("Failed to create chapter");
    }
  };

  const handleDeleteChapter = async (chapterId) => {
    if (!confirm("Are you sure you want to delete this chapter? This action cannot be undone.")) {
      return;
    }

    try {
      await chapterService.delete(chapterId);
      
      const updatedChapters = await chapterService.getByStoryId(storyId);
      setChapters(updatedChapters);
      
      // Update story chapter count
      if (story) {
        await storyService.update(storyId, { chapterCount: updatedChapters.length });
        setStory(prev => ({ ...prev, chapterCount: updatedChapters.length }));
      }
      
      toast.success("Chapter deleted successfully");
    } catch (err) {
      console.error("Error deleting chapter:", err);
      toast.error("Failed to delete chapter");
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorView message={error} onRetry={loadData} />;
  if (!story) return <ErrorView message="Story not found" />;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/my-stories")}
            className="text-gray-600 hover:text-gray-900"
          >
            <ApperIcon name="ArrowLeft" size={16} />
            Back to My Stories
          </Button>
        </div>
        
        <div className="bg-white rounded-lg shadow-card p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{story.title}</h1>
              <p className="text-gray-600 mb-4">{story.description}</p>
              
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <ApperIcon name="BookOpen" size={16} />
                  <span>{chapters.length} chapters</span>
                </div>
                <div className="flex items-center gap-1">
                  <ApperIcon name="Eye" size={16} />
                  <span>{story.views || 0} views</span>
                </div>
                <div className="flex items-center gap-1">
                  <ApperIcon name="Calendar" size={16} />
                  <span>{new Date(story.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
            >
              <ApperIcon name="Plus" size={16} />
              Add Chapter
            </Button>
          </div>
        </div>
      </div>

      {/* Chapters List */}
      <div className="bg-white rounded-lg shadow-card">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Chapters</h2>
        </div>
        
        <div className="p-6">
          {chapters.length === 0 ? (
            <Empty
              title="No chapters yet"
              description="Start writing your story by adding the first chapter."
              actionText="Add Chapter"
              onAction={() => setIsCreateModalOpen(true)}
            />
          ) : (
            <div className="space-y-3">
              {chapters.map((chapter) => (
                <div
                  key={chapter.Id}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-indigo-50 rounded-lg border border-slate-200 hover:shadow-sm transition-shadow duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold">
                      {chapter.chapterNumber}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        Chapter {chapter.chapterNumber}: {chapter.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                        <span>{chapter.wordCount || 0} words</span>
                        <span>Updated {new Date(chapter.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toast.info(`Editing Chapter ${chapter.chapterNumber} - Feature coming soon!`)}
                    >
                      <ApperIcon name="Edit" size={16} />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteChapter(chapter.Id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <ApperIcon name="Trash2" size={16} />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Chapter Modal */}
      <CreateChapterModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateChapter}
        storyTitle={story?.title}
        nextChapterNumber={chapters.length + 1}
      />
    </div>
  );
};

export default ChapterList;