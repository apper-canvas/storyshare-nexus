import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import storyService from "@/services/api/storyService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import StoryGrid from "@/components/organisms/StoryGrid";

const Library = () => {
  const navigate = useNavigate();
const [wantToReadStories, setWantToReadStories] = useState([]);
  const [currentlyReadingStories, setCurrentlyReadingStories] = useState([]);
  const [completedStories, setCompletedStories] = useState([]);
  const [activeSection, setActiveSection] = useState("want-to-read");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

const loadLibraryData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [wantToRead, currentlyReading, completed] = await Promise.all([
        storyService.getLibraryStories('want-to-read'),
        storyService.getLibraryStories('currently-reading'),
        storyService.getLibraryStories('completed')
      ]);

      setWantToReadStories(wantToRead);
      setCurrentlyReadingStories(currentlyReading);
      setCompletedStories(completed);
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

const handleRemoveFromLibrary = async (storyId) => {
    try {
      await storyService.removeFromLibrary(storyId);
      
      // Remove from all sections
      setWantToReadStories(prev => prev.filter(story => story.Id !== storyId));
      setCurrentlyReadingStories(prev => prev.filter(story => story.Id !== storyId));
      setCompletedStories(prev => prev.filter(story => story.Id !== storyId));
      
      toast.success("Story removed from library.");
    } catch (error) {
      toast.error("Failed to remove story. Please try again.");
    }
  };

  const handleMoveStory = async (storyId, newStatus) => {
    try {
      await storyService.updateLibraryStatus(storyId, newStatus);
      
      // Reload library data to ensure consistency
      await loadLibraryData();
      
      const statusLabels = {
        'want-to-read': 'Want to Read',
        'currently-reading': 'Currently Reading',
        'completed': 'Completed'
      };
      
      toast.success(`Story moved to ${statusLabels[newStatus]}.`);
    } catch (error) {
      toast.error("Failed to move story. Please try again.");
    }
  };

const handleClearSection = () => {
    if (confirm(`Are you sure you want to clear all stories from ${getSectionLabel(activeSection)}?`)) {
      const currentStories = getCurrentStories();
      
      currentStories.forEach(story => {
        storyService.removeFromLibrary(story.Id).catch(console.error);
      });
      
      if (activeSection === 'want-to-read') setWantToReadStories([]);
      else if (activeSection === 'currently-reading') setCurrentlyReadingStories([]);
      else if (activeSection === 'completed') setCompletedStories([]);
      
      toast.info(`${getSectionLabel(activeSection)} cleared.`);
    }
  };

const sections = [
    { 
      id: "want-to-read", 
      label: "Want to Read", 
      icon: "BookMarked", 
      count: wantToReadStories.length,
      color: "from-blue-500 to-indigo-600"
    },
    { 
      id: "currently-reading", 
      label: "Currently Reading", 
      icon: "BookOpen", 
      count: currentlyReadingStories.length,
      color: "from-green-500 to-emerald-600"
    },
    { 
      id: "completed", 
      label: "Completed", 
      icon: "CheckCircle", 
      count: completedStories.length,
      color: "from-purple-500 to-violet-600"
    }
  ];

  const getCurrentStories = () => {
    switch (activeSection) {
      case 'want-to-read': return wantToReadStories;
      case 'currently-reading': return currentlyReadingStories;
      case 'completed': return completedStories;
      default: return [];
    }
  };

  const getSectionLabel = (sectionId) => {
    const section = sections.find(s => s.id === sectionId);
    return section ? section.label : '';
  };

  const getTotalCount = () => {
    return wantToReadStories.length + currentlyReadingStories.length + completedStories.length;
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-6">
{/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Library</h1>
          <p className="text-gray-600">
            Organize your stories into Want to Read, Currently Reading, and Completed.
          </p>
        </div>

        {/* Library Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {sections.map((section) => (
            <div 
              key={section.id}
              className="bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-card border border-white/50 cursor-pointer hover:shadow-card-hover transition-all duration-200"
              onClick={() => setActiveSection(section.id)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{section.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{section.count}</p>
                </div>
                <div className={`w-10 h-10 bg-gradient-to-br ${section.color} rounded-lg flex items-center justify-center`}>
                  <ApperIcon name={section.icon} size={20} className="text-white" />
                </div>
              </div>
            </div>
          ))}

          <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-card border border-white/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Stories</p>
                <p className="text-2xl font-bold text-gray-900">{getTotalCount()}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-slate-400 to-gray-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="Library" size={20} className="text-white" />
              </div>
            </div>
          </div>
        </div>

{/* Section Navigation */}
        <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-card border border-white/50 mb-8">
          <div className="flex flex-col sm:flex-row border-b border-gray-200">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-all duration-200 ${
                  activeSection === section.id
                    ? "text-primary border-b-2 border-primary bg-gradient-to-r from-primary/5 to-secondary/5"
                    : "text-gray-600 hover:text-primary hover:bg-gray-50"
                }`}
              >
                <ApperIcon name={section.icon} size={18} />
                <span className="hidden sm:inline">{section.label}</span>
                <span className="sm:hidden">{section.label.split(' ')[0]}</span>
                <Badge 
                  variant={activeSection === section.id ? "primary" : "ghost"} 
                  size="xs"
                >
                  {section.count}
                </Badge>
              </button>
            ))}
          </div>

          {/* Section Actions */}
          <div className="p-4 bg-gradient-to-r from-slate-50 to-indigo-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {activeSection === "want-to-read" && "Stories you want to read later"}
                  {activeSection === "currently-reading" && "Stories you're actively reading"}
                  {activeSection === "completed" && "Stories you've finished reading"}
                </p>
                {getCurrentStories().length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {activeSection !== 'want-to-read' && (
                      <button
                        onClick={() => {
                          getCurrentStories().forEach(story => {
                            handleMoveStory(story.Id, 'want-to-read');
                          });
                        }}
                        className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        <ApperIcon name="BookMarked" size={12} />
                        Move all to Want to Read
                      </button>
                    )}
                    {activeSection !== 'currently-reading' && (
                      <button
                        onClick={() => {
                          getCurrentStories().forEach(story => {
                            handleMoveStory(story.Id, 'currently-reading');
                          });
                        }}
                        className="text-xs text-green-600 hover:text-green-700 flex items-center gap-1"
                      >
                        <ApperIcon name="BookOpen" size={12} />
                        Move all to Currently Reading
                      </button>
                    )}
                    {activeSection !== 'completed' && (
                      <button
                        onClick={() => {
                          getCurrentStories().forEach(story => {
                            handleMoveStory(story.Id, 'completed');
                          });
                        }}
                        className="text-xs text-purple-600 hover:text-purple-700 flex items-center gap-1"
                      >
                        <ApperIcon name="CheckCircle" size={12} />
                        Move all to Completed
                      </button>
                    )}
                  </div>
                )}
              </div>
              
              {getCurrentStories().length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  icon="Trash2"
                  onClick={handleClearSection}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Clear Section
                </Button>
              )}
            </div>
          </div>
        </div>

{/* Stories Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <ApperIcon name={sections.find(s => s.id === activeSection)?.icon} size={20} />
              {getSectionLabel(activeSection)}
            </h2>
            {getCurrentStories().length > 0 && (
              <span className="text-sm text-gray-500">
                {getCurrentStories().length} stories
              </span>
            )}
          </div>
          
          <StoryGrid
            stories={getCurrentStories()}
            loading={loading}
            error={error}
            onRetry={handleRetry}
            emptyTitle={`No ${getSectionLabel(activeSection).toLowerCase()}`}
            emptyDescription={
              activeSection === "want-to-read"
                ? "Add stories you want to read later from story pages."
                : activeSection === "currently-reading"
                ? "Stories you're actively reading will appear here."
                : "Stories you've completed will be shown here."
            }
            emptyActionLabel="Browse Stories"
            emptyIcon={sections.find(s => s.id === activeSection)?.icon}
            onEmptyAction={() => navigate('/browse')}
          />
        </div>

        {/* Quick Actions for Individual Stories */}
        {getCurrentStories().length > 0 && (
          <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-card border border-white/50 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ApperIcon name="Zap" size={20} />
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {getCurrentStories().slice(0, 3).map((story) => (
                <div key={story.Id} className="flex items-center gap-3 p-3 bg-gradient-to-r from-slate-50 to-indigo-50 rounded-lg border border-slate-200">
                  <div className="w-10 h-12 bg-gradient-to-br from-indigo-100 to-purple-200 rounded flex items-center justify-center flex-shrink-0">
                    <ApperIcon name="BookOpen" size={16} className="text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm truncate">{story.title}</h4>
                    <div className="flex gap-1 mt-1">
                      <select
                        value={story.libraryStatus}
                        onChange={(e) => handleMoveStory(story.Id, e.target.value)}
                        className="text-xs border border-gray-200 rounded px-2 py-1 bg-white"
                      >
                        <option value="want-to-read">Want to Read</option>
                        <option value="currently-reading">Currently Reading</option>
                        <option value="completed">Completed</option>
                      </select>
                      <button
                        onClick={() => handleRemoveFromLibrary(story.Id)}
                        className="text-xs text-red-600 hover:text-red-700 px-2 py-1"
                        title="Remove from library"
                      >
                        <ApperIcon name="X" size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

{/* Reading Recommendations */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-accent to-pink-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Sparkles" size={16} className="text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Recommended for You</h3>
          </div>
          <p className="text-gray-700 mb-4">
            Based on your library, we think you might enjoy these genres:
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary">Fantasy</Badge>
            <Badge variant="accent">Romance</Badge>
            <Badge variant="primary">Adventure</Badge>
            <Badge variant="ghost">Mystery</Badge>
          </div>
          <Button variant="primary" size="sm" icon="Search" onClick={() => navigate('/browse')}>
            Discover New Stories
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Library;