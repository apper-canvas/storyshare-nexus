import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { storyService } from "@/services/api/storyService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import StoryGrid from "@/components/organisms/StoryGrid";
import Browse from "@/components/pages/Browse";
const Home = () => {
  const navigate = useNavigate();
  const [featuredStories, setFeaturedStories] = useState([]);
  const [trendingStories, setTrendingStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const allStories = await storyService.getAll();
      
      // Get featured stories (published stories with high views)
      const featured = allStories
        .filter(story => story.status === "published")
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 8);

      // Get trending stories (recently updated published stories)
      const trending = allStories
        .filter(story => story.status === "published")
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 12);

      setFeaturedStories(featured);
      setTrendingStories(trending);
    } catch (err) {
      setError("Failed to load stories. Please try again.");
      console.error("Error loading home data:", err);
    } finally {
      setLoading(false);
    }
  };

const handleRetry = () => {
    loadHomeData();
  };

  const handleBrowseStories = () => {
    navigate("/browse");
    toast.info("Explore thousands of amazing stories!");
  };

  const handleStartWriting = () => {
    navigate("/my-stories");
    toast.info("Start your writing journey today!");
};

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Skeleton */}
          <div className="mb-12">
            <div className="h-10 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg w-80 mb-4 animate-pulse"></div>
            <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-96 animate-pulse"></div>
          </div>
          
          {/* Featured Stories Skeleton */}
          <div className="mb-12">
            <div className="h-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg w-48 mb-6 animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-card overflow-hidden animate-pulse">
                  <div className="aspect-[3/4] bg-gradient-to-br from-slate-200 to-slate-300"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-5 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-full"></div>
                    <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-2/3"></div>
                    <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Hero Section */}
        <section className="mb-12 text-center">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-card-hover border border-white/50">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Discover Amazing Stories
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Join thousands of readers and writers in a community where imagination comes to life. 
              Find your next favorite story or share your own masterpiece.
            </p>
<div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" icon="Search" className="shadow-xl" onClick={handleBrowseStories}>
                Browse Stories
              </Button>
              <Button size="lg" variant="secondary" icon="Edit3" className="shadow-xl" onClick={handleStartWriting}>
                Start Writing
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Stories */}
        {featuredStories.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Star" size={20} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Featured Stories</h2>
                <Badge variant="accent" size="sm">Popular</Badge>
              </div>
            </div>
            
            <StoryGrid
              stories={featuredStories}
              className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
              emptyTitle="No featured stories available"
              emptyDescription="Check back soon for featured content!"
            />
          </section>
        )}

        {/* Trending Stories */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="TrendingUp" size={20} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Trending Now</h2>
              <Badge variant="success" size="sm">Hot</Badge>
            </div>
            <Button variant="ghost" icon="ArrowRight" iconPosition="right">
              View All
            </Button>
          </div>
          
          <StoryGrid
            stories={trendingStories}
            loading={loading}
            error={error}
            onRetry={handleRetry}
            emptyTitle="No trending stories"
            emptyDescription="Be the first to publish a trending story!"
            emptyActionLabel="Start Writing"
          />
        </section>

        {/* Stats Section */}
        <section className="mt-16 mb-8">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-card border border-white/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name="BookOpen" size={24} className="text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  {featuredStories.length + trendingStories.length}+
                </h3>
                <p className="text-gray-600">Published Stories</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-secondary to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name="Users" size={24} className="text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">1,000+</h3>
                <p className="text-gray-600">Active Writers</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name="Heart" size={24} className="text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">50K+</h3>
                <p className="text-gray-600">Story Views</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;