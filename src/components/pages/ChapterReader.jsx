import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import ApperIcon from "@/components/ApperIcon";
import chapterService from "@/services/api/chapterService";
import storyService from "@/services/api/storyService";

export default function ChapterReader() {
  const { storyId, chapterNumber } = useParams();
  const navigate = useNavigate();
  const [chapter, setChapter] = useState(null);
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [navigation, setNavigation] = useState({ hasPrev: false, hasNext: false });

  useEffect(() => {
    loadChapterAndStory();
  }, [storyId, chapterNumber]);

  const loadChapterAndStory = async () => {
    setLoading(true);
    setError(null);

    try {
      // Load story and chapters in parallel
      const [storyData, allChapters] = await Promise.all([
        storyService.getById(parseInt(storyId)),
        chapterService.getByStoryId(parseInt(storyId))
      ]);

      setStory(storyData);

      // Find the current chapter
      const currentChapter = allChapters.find(c => c.chapterNumber === parseInt(chapterNumber));
      if (!currentChapter) {
        setError("Chapter not found");
        return;
      }

      setChapter(currentChapter);

      // Set navigation state
      const chapterIndex = allChapters.findIndex(c => c.chapterNumber === parseInt(chapterNumber));
      setNavigation({
        hasPrev: chapterIndex > 0,
        hasNext: chapterIndex < allChapters.length - 1,
        prevChapter: chapterIndex > 0 ? allChapters[chapterIndex - 1].chapterNumber : null,
        nextChapter: chapterIndex < allChapters.length - 1 ? allChapters[chapterIndex + 1].chapterNumber : null
      });

    } catch (err) {
      setError(err.message || "Failed to load chapter");
      console.error("Error loading chapter:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToStory = () => {
    navigate(`/story/${storyId}`);
    toast.success("Returned to story details");
  };

  const handlePreviousChapter = () => {
    if (navigation.hasPrev && navigation.prevChapter) {
      navigate(`/story/${storyId}/chapter/${navigation.prevChapter}`);
      toast.info(`Reading Chapter ${navigation.prevChapter}`);
    }
  };

  const handleNextChapter = () => {
    if (navigation.hasNext && navigation.nextChapter) {
      navigate(`/story/${storyId}/chapter/${navigation.nextChapter}`);
      toast.info(`Reading Chapter ${navigation.nextChapter}`);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <ErrorView 
        message={error}
        onRetry={loadChapterAndStory}
      />
    );
  }

  if (!chapter || !story) {
    return (
      <ErrorView 
        message="Chapter or story not found"
        onRetry={loadChapterAndStory}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header Navigation */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-sm border-b border-gray-200 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleBackToStory}
              className="flex items-center gap-2"
            >
              <ApperIcon name="ArrowLeft" size={20} />
              Back to Story
            </Button>
            
            <div className="text-center">
              <h1 className="text-lg font-semibold text-gray-900">
                {story.title}
              </h1>
              <p className="text-sm text-gray-600">
                Chapter {chapter.chapterNumber}: {chapter.title}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePreviousChapter}
                disabled={!navigation.hasPrev}
                className="flex items-center gap-1"
              >
                <ApperIcon name="ChevronLeft" size={16} />
                Previous
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNextChapter}
                disabled={!navigation.hasNext}
                className="flex items-center gap-1"
              >
                Next
                <ApperIcon name="ChevronRight" size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Chapter Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-card p-8 md:p-12">
          {/* Chapter Header */}
          <div className="mb-8 text-center border-b border-gray-200 pb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Chapter {chapter.chapterNumber}
            </h1>
            <h2 className="text-xl text-gray-700 font-medium">
              {chapter.title}
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              {chapter.wordCount || 0} words
            </p>
          </div>

          {/* Chapter Content */}
          <div className="prose prose-lg max-w-none">
            <div 
              className="text-gray-800 leading-relaxed font-serif text-lg"
              style={{ lineHeight: '1.8' }}
            >
              {chapter.content ? (
                chapter.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-6">
                    {paragraph}
                  </p>
                ))
              ) : (
                <div className="text-center text-gray-500 py-12">
                  <p>No content available for this chapter.</p>
                </div>
              )}
            </div>
          </div>

          {/* Chapter Navigation Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handlePreviousChapter}
                disabled={!navigation.hasPrev}
                className="flex items-center gap-2"
              >
                <ApperIcon name="ChevronLeft" size={20} />
                {navigation.hasPrev ? `Chapter ${navigation.prevChapter}` : 'No Previous Chapter'}
              </Button>

              <Button
                variant="ghost"
                onClick={handleBackToStory}
                className="flex items-center gap-2"
              >
                <ApperIcon name="Book" size={20} />
                Story Details
              </Button>

              <Button
                variant="outline"
                onClick={handleNextChapter}
                disabled={!navigation.hasNext}
                className="flex items-center gap-2"
              >
                {navigation.hasNext ? `Chapter ${navigation.nextChapter}` : 'No Next Chapter'}
                <ApperIcon name="ChevronRight" size={20} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}