import { type Article, type InsertArticle, type Summary, type InsertSummary, type Bookmark, type InsertBookmark } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Articles
  getArticles(category?: string, search?: string, limit?: number, offset?: number): Promise<Article[]>;
  getArticle(id: string): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  createArticles(articles: InsertArticle[]): Promise<Article[]>;
  
  // Summaries
  getSummary(articleId: string): Promise<Summary | undefined>;
  createSummary(summary: InsertSummary): Promise<Summary>;
  
  // Bookmarks
  getBookmarks(): Promise<Bookmark[]>;
  createBookmark(bookmark: InsertBookmark): Promise<Bookmark>;
  deleteBookmark(articleId: string): Promise<boolean>;
  isBookmarked(articleId: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private articles: Map<string, Article>;
  private summaries: Map<string, Summary>;
  private bookmarks: Map<string, Bookmark>;

  constructor() {
    this.articles = new Map();
    this.summaries = new Map();
    this.bookmarks = new Map();
  }

  async getArticles(category?: string, search?: string, limit = 20, offset = 0): Promise<Article[]> {
    let articles = Array.from(this.articles.values());
    
    // Filter by category
    if (category && category !== "all") {
      articles = articles.filter(article => article.category.toLowerCase() === category.toLowerCase());
    }
    
    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase();
      articles = articles.filter(article => 
        article.title.toLowerCase().includes(searchLower) ||
        article.description?.toLowerCase().includes(searchLower) ||
        article.source.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort by published date (newest first)
    articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    
    // Apply pagination
    return articles.slice(offset, offset + limit);
  }

  async getArticle(id: string): Promise<Article | undefined> {
    return this.articles.get(id);
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const article: Article = {
      ...insertArticle,
      id: insertArticle.id || randomUUID(),
      content: insertArticle.content || null,
      description: insertArticle.description || null,
      urlToImage: insertArticle.urlToImage || null,
    };
    this.articles.set(article.id, article);
    return article;
  }

  async createArticles(insertArticles: InsertArticle[]): Promise<Article[]> {
    const articles: Article[] = [];
    for (const insertArticle of insertArticles) {
      const article = await this.createArticle(insertArticle);
      articles.push(article);
    }
    return articles;
  }

  async getSummary(articleId: string): Promise<Summary | undefined> {
    return Array.from(this.summaries.values()).find(summary => summary.articleId === articleId);
  }

  async createSummary(insertSummary: InsertSummary): Promise<Summary> {
    const summary: Summary = {
      ...insertSummary,
      id: randomUUID(),
      createdAt: new Date(),
    };
    this.summaries.set(summary.id, summary);
    return summary;
  }

  async getBookmarks(): Promise<Bookmark[]> {
    return Array.from(this.bookmarks.values()).sort(
      (a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async createBookmark(insertBookmark: InsertBookmark): Promise<Bookmark> {
    const bookmark: Bookmark = {
      ...insertBookmark,
      id: randomUUID(),
      createdAt: new Date(),
    };
    this.bookmarks.set(bookmark.id, bookmark);
    return bookmark;
  }

  async deleteBookmark(articleId: string): Promise<boolean> {
    const bookmark = Array.from(this.bookmarks.values()).find(b => b.articleId === articleId);
    if (bookmark) {
      this.bookmarks.delete(bookmark.id);
      return true;
    }
    return false;
  }

  async isBookmarked(articleId: string): Promise<boolean> {
    return Array.from(this.bookmarks.values()).some(b => b.articleId === articleId);
  }
}

export const storage = new MemStorage();
