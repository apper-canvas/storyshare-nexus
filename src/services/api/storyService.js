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

  async getByAuthorId(authorId) {
    await delay(250);
    return this.stories.filter(s => s.authorId === authorId).map(s => ({ ...s }));
  }

  async getByGenre(genre) {
    await delay(300);
    return this.stories.filter(s => s.genre.toLowerCase() === genre.toLowerCase()).map(s => ({ ...s }));
  }

  async getFeatured() {
    await delay(350);
    return this.stories
      .filter(s => s.status === "published")
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 8)
      .map(s => ({ ...s }));
  }

  async getTrending() {
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.stories.unshift(newStory);
    return { ...newStory };
  }

  async update(id, updateData) {
    await delay(400);
    
    const index = this.stories.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Story not found");
    }

    this.stories[index] = {
      ...this.stories[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    return { ...this.stories[index] };
  }

  async delete(id) {
    await delay(300);
    
    const index = this.stories.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Story not found");
    }

    this.stories.splice(index, 1);
    return true;
  }

  async search(query) {
    await delay(350);
    
    const searchTerm = query.toLowerCase();
    return this.stories
      .filter(story =>
        story.title.toLowerCase().includes(searchTerm) ||
        story.description.toLowerCase().includes(searchTerm) ||
        story.authorName.toLowerCase().includes(searchTerm) ||
        story.genre.toLowerCase().includes(searchTerm)
      )
      .map(s => ({ ...s }));
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

export const storyService = new StoryService();