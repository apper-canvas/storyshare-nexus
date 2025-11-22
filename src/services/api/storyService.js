import storiesData from "@/services/mockData/stories.json";

// Simulate API delay for realistic loading states
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class StoryService {
  constructor() {
    this.stories = [...storiesData];
  }

async getAll() {
    await delay(300);
    return [...this.stories];
  }
async getById(id) {
    await delay(200);
    const story = this.stories.find(s => s.Id === parseInt(id));
    if (!story) {
      throw new Error("Story not found");
    }
    return { ...story };
  }

async getByAuthor(authorId) {
    await delay(250);
    return this.stories.filter(s => s.authorId === authorId).map(s => ({ ...s }));
  }
async getByGenre(genre) {
    await delay(300);
    return this.stories.filter(s => s.genre.toLowerCase() === genre.toLowerCase()).map(s => ({ ...s }));
  }
async getTrending() {
    await delay(350);
    return this.stories
      .filter(s => s.status === "published")
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 8)
      .map(s => ({ ...s }));
  }
async getFeatured() {
    await delay(400);
    return this.stories
      .filter(s => s.status === "published")
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 12)
      .map(s => ({ ...s }));
  }
async create(storyData) {
    await delay(500);
    
    // Find the highest Id and add 1
    const maxId = this.stories.reduce((max, story) => Math.max(max, story.Id), 0);
    const newId = maxId + 1;
    
    const newStory = {
      Id: newId,
      ...storyData,
      authorId: 1, // Current user ID - in real app this would come from auth
      authorName: "Current User", // In real app this would come from user profile
      status: "draft",
      views: 0,
      chapterCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.stories.unshift(newStory);
    return { ...newStory };
}

  async update(id, updateData) {
    await delay(400);
    
    const storyIndex = this.stories.findIndex(s => s.Id === parseInt(id));
    if (storyIndex === -1) {
      throw new Error("Story not found");
    }

    this.stories[storyIndex] = {
      ...this.stories[storyIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    return { ...this.stories[storyIndex] };
  }

  async delete(id) {
    await delay(300);
    
    const storyIndex = this.stories.findIndex(s => s.Id === parseInt(id));
    if (storyIndex === -1) {
      throw new Error("Story not found");
    }

    const deletedStory = this.stories.splice(storyIndex, 1)[0];
    return { ...deletedStory };
  }

  async publish(id) {
    await delay(400);
    return this.update(id, { status: "published" });
  }

  async unpublish(id) {
    await delay(400);
    return this.update(id, { status: "draft" });
}

  async search(searchTerm) {
    await delay(300);
    const term = searchTerm.toLowerCase();
    
    return this.stories
      .filter(story => 
        story.title.toLowerCase().includes(term) ||
        story.description.toLowerCase().includes(term) ||
        story.authorName.toLowerCase().includes(term) ||
        story.genre.toLowerCase().includes(term)
      )
      .map(s => ({ ...s }));
  }

  // Social features
  async bookmark(storyId, userId = 1) {
    await delay(200);
    // In real app, this would save to user's bookmarks
    console.log(`User ${userId} bookmarked story ${storyId}`);
    return { success: true };
  }

  async unbookmark(storyId, userId = 1) {
    await delay(200);
    // In real app, this would remove from user's bookmarks
    console.log(`User ${userId} unbookmarked story ${storyId}`);
    return { success: true };
  }

  async getUserBookmarks(userId = 1) {
    await delay(300);
    // Return mock bookmarked stories
    return this.stories
      .filter(s => s.status === "published")
      .slice(0, 6)
      .map(s => ({ ...s }));
  }

  async getReadingHistory(userId = 1) {
    await delay(250);
    // Return mock reading history
    return this.stories
      .filter(s => s.status === "published")
      .slice(3, 9)
      .map(s => ({ ...s }));
  }

  async updateReadingProgress(storyId, progress, userId = 1) {
    await delay(200);
    // In real app, this would save reading progress
    console.log(`User ${userId} progress on story ${storyId}: ${progress}%`);
    return { success: true };
return { success: true };
  }

  async incrementViews(id) {
    await delay(100);
    
    const index = this.stories.findIndex(s => s.Id === parseInt(id));
    if (index !== -1) {
      this.stories[index].views = (this.stories[index].views || 0) + 1;
      return this.stories[index].views;
    }
    return 0;
  }
}