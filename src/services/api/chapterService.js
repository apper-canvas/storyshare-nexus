import chaptersData from '@/services/mockData/chapters.json';

// Simulate network delay for realistic UX
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ChapterService {
  constructor() {
    this.chapters = [...chaptersData];
  }

  async getAll() {
    await delay(300);
    return [...this.chapters];
  }

  async getById(id) {
    await delay(200);
    const chapter = this.chapters.find(c => c.Id === parseInt(id));
    if (!chapter) {
      throw new Error("Chapter not found");
    }
    return { ...chapter };
  }

  async getByStoryId(storyId) {
    await delay(250);
    return this.chapters
      .filter(c => c.storyId === parseInt(storyId))
      .sort((a, b) => a.chapterNumber - b.chapterNumber)
      .map(c => ({ ...c }));
  }

  async create(chapterData) {
    await delay(500);
    
    // Find the highest Id and add 1
    const maxId = this.chapters.reduce((max, chapter) => Math.max(max, chapter.Id), 0);
    const newId = maxId + 1;
    
    // Find the highest chapter number for this story
    const storyChapters = this.chapters.filter(c => c.storyId === parseInt(chapterData.storyId));
    const maxChapterNumber = storyChapters.reduce((max, chapter) => Math.max(max, chapter.chapterNumber), 0);
    const newChapterNumber = maxChapterNumber + 1;
    
    const newChapter = {
      Id: newId,
      storyId: parseInt(chapterData.storyId),
      chapterNumber: newChapterNumber,
      title: chapterData.title,
      content: chapterData.content,
      wordCount: chapterData.content ? chapterData.content.split(/\s+/).length : 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.chapters.unshift(newChapter);
    return { ...newChapter };
  }

  async update(id, updateData) {
    await delay(400);
    
    const chapterIndex = this.chapters.findIndex(c => c.Id === parseInt(id));
    if (chapterIndex === -1) {
      throw new Error("Chapter not found");
    }

    const updatedData = { ...updateData };
    if (updatedData.content) {
      updatedData.wordCount = updatedData.content.split(/\s+/).length;
    }

    this.chapters[chapterIndex] = {
      ...this.chapters[chapterIndex],
      ...updatedData,
      updatedAt: new Date().toISOString()
    };

    return { ...this.chapters[chapterIndex] };
  }

  async delete(id) {
    await delay(300);
    
    const chapterIndex = this.chapters.findIndex(c => c.Id === parseInt(id));
    if (chapterIndex === -1) {
      throw new Error("Chapter not found");
    }

    const deletedChapter = this.chapters.splice(chapterIndex, 1)[0];
    
    // Renumber remaining chapters for the same story
    const storyId = deletedChapter.storyId;
    const storyChapters = this.chapters
      .filter(c => c.storyId === storyId)
      .sort((a, b) => a.chapterNumber - b.chapterNumber);
    
    storyChapters.forEach((chapter, index) => {
      const chapterIndex = this.chapters.findIndex(c => c.Id === chapter.Id);
      this.chapters[chapterIndex].chapterNumber = index + 1;
    });

    return { ...deletedChapter };
  }

  async reorder(storyId, chapterIds) {
    await delay(400);
    
    const storyChapters = this.chapters.filter(c => c.storyId === parseInt(storyId));
    
    chapterIds.forEach((chapterId, index) => {
      const chapterIndex = this.chapters.findIndex(c => c.Id === parseInt(chapterId));
      if (chapterIndex !== -1) {
        this.chapters[chapterIndex].chapterNumber = index + 1;
        this.chapters[chapterIndex].updatedAt = new Date().toISOString();
      }
    });
return this.getByStoryId(storyId);
  }

  async getNextChapter(storyId, currentChapterNumber) {
    await delay(200);
    const storyChapters = await this.getByStoryId(storyId);
    const currentIndex = storyChapters.findIndex(c => c.chapterNumber === currentChapterNumber);
    
    if (currentIndex !== -1 && currentIndex < storyChapters.length - 1) {
      return storyChapters[currentIndex + 1];
    }
    return null;
  }

  async getPreviousChapter(storyId, currentChapterNumber) {
    await delay(200);
    const storyChapters = await this.getByStoryId(storyId);
    const currentIndex = storyChapters.findIndex(c => c.chapterNumber === currentChapterNumber);
    
    if (currentIndex > 0) {
      return storyChapters[currentIndex - 1];
    }
    return null;
  }
}

export default new ChapterService();