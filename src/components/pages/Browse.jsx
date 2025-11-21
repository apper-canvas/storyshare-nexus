import React, { useState, useEffect } from "react";
import StoryGrid from "@/components/organisms/StoryGrid";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";
import { storyService } from "@/services/api/storyService";

const Browse = () => {
  const [stories, setStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const genres = [
    { value: "", label: "All Genres" },
    { value: "fantasy", label: "Fantasy" },
    { value: "romance", label: "Romance" },
    { value: "mystery", label: "Mystery" },
    { value: "sci-fi", label: "Science Fiction" },
    { value: "thriller", label: "Thriller" },
    { value: "adventure", label: "Adventure" },
    { value: "drama", label: "Drama" },
    { value: "horror", label: "Horror" },
    { value: "comedy", label: "Comedy" },
    { value: "historical", label: "Historical Fiction" }
  ];

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "popular", label: "Most Popular" },
    { value: "title", label: "Title A-Z" }
  ];

  useEffect(() => {
    loadAllStories();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [stories, searchQuery, selectedGenre, sortBy]);

  const loadAllStories = async () => {
    setLoading(true);
    setError("");
    
    try {
      const allStories = await storyService.getAll();
      // Only show published stories in browse
      const publishedStories = allStories.filter(story => story.status === "published");
      setStories(publishedStories);
    } catch (err) {
      setError("Failed to load stories. Please try again.");
      console.error("Error loading stories:", err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...stories];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(story =>
        story.title.toLowerCase().includes(query) ||
        story.description.toLowerCase().includes(query) ||
        story.authorName.toLowerCase().includes(query) ||
        story.genre.toLowerCase().includes(query)
      );
    }

    // Apply genre filter
    if (selectedGenre) {
      filtered = filtered.filter(story => story.genre === selectedGenre);
    }

    // Apply sorting
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "popular":
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case "title":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    setFilteredStories(filtered);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleGenreChange = (e) => {
    setSelectedGenre(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedGenre("");
    setSortBy("newest");
  };

  const handleRetry = () => {
    loadAllStories();
  };

  const getGenreStats = () => {
    const genreCount = {};
    stories.forEach(story => {
      genreCount[story.genre] = (genreCount[story.genre] || 0) + 1;
    });
    return genreCount;
  };

  const genreStats = getGenreStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Stories</h1>
          <p className="text-gray-600">
            Discover amazing stories from talented writers around the world.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-card border border-white/50 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
            {/* Search */}
            <div className="flex-1 min-w-0">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <SearchBar
                value={searchQuery}
                onChange={handleSearchChange}
                onSearch={handleSearch}
                placeholder="Search by title, author, or description..."
                className="w-full"
              />
            </div>

            {/* Genre Filter */}
            <div className="w-full lg:w-48">
              <Select
                label="Genre"
                value={selectedGenre}
                onChange={handleGenreChange}
                options={genres}
              />
            </div>

            {/* Sort */}
            <div className="w-full lg:w-48">
              <Select
                label="Sort By"
                value={sortBy}
                onChange={handleSortChange}
                options={sortOptions}
              />
            </div>

            {/* Clear Filters */}
            <Button
              variant="ghost"
              icon="X"
              onClick={clearFilters}
              className="lg:mb-0"
            >
              Clear
            </Button>
          </div>

          {/* Active Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {searchQuery && (
              <Badge variant="primary" size="sm">
                Search: "{searchQuery}"
              </Badge>
            )}
            {selectedGenre && (
              <Badge variant="secondary" size="sm">
                Genre: {genres.find(g => g.value === selectedGenre)?.label}
              </Badge>
            )}
            {sortBy !== "newest" && (
              <Badge variant="accent" size="sm">
                Sort: {sortOptions.find(s => s.value === sortBy)?.label}
              </Badge>
            )}
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <ApperIcon name="Search" size={20} className="text-gray-600" />
            <span className="text-gray-700">
              {loading ? "Loading..." : `${filteredStories.length} stories found`}
            </span>
          </div>
          
          {!loading && stories.length > 0 && (
            <div className="text-sm text-gray-600">
              Total: {stories.length} published stories
            </div>
          )}
        </div>

        {/* Stories Grid */}
        <StoryGrid
          stories={filteredStories}
          loading={loading}
          error={error}
          onRetry={handleRetry}
          emptyTitle={searchQuery || selectedGenre ? "No matching stories" : "No stories available"}
          emptyDescription={
            searchQuery || selectedGenre 
              ? "Try adjusting your search criteria or filters." 
              : "Check back soon for new published stories!"
          }
          emptyActionLabel="Clear Filters"
          onEmptyAction={searchQuery || selectedGenre ? clearFilters : undefined}
        />

        {/* Genre Statistics */}
        {!loading && Object.keys(genreStats).length > 0 && (
          <div className="mt-12 bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-card border border-white/50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ApperIcon name="BarChart3" size={20} />
              Genre Distribution
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {Object.entries(genreStats)
                .sort(([,a], [,b]) => b - a)
                .map(([genre, count]) => (
                  <div key={genre} className="text-center p-3 bg-gradient-to-br from-slate-50 to-indigo-50 rounded-lg border border-slate-200">
                    <div className="text-lg font-bold text-gray-900">{count}</div>
                    <div className="text-sm text-gray-600 capitalize">{genre}</div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Browse;