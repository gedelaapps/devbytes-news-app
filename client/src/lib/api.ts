import { apiRequest } from "./queryClient";
import type { Article, NewsCategory, ChatMessage } from "@shared/schema";

export const newsAPI = {
  getNews: async (category: NewsCategory = "all", search?: string, limit = 20, offset = 0): Promise<Article[]> => {
    const params = new URLSearchParams({
      category,
      limit: limit.toString(),
      offset: offset.toString(),
    });
    
    if (search) {
      params.append("search", search);
    }
    
    const response = await apiRequest("GET", `/api/news?${params}`);
    return response.json();
  },

  getArticle: async (id: string): Promise<Article> => {
    const response = await apiRequest("GET", `/api/articles/${id}`);
    return response.json();
  },

  generateSummary: async (articleId: string) => {
    const response = await apiRequest("POST", `/api/articles/${articleId}/summary`);
    return response.json();
  },

  sendChatMessage: async (message: string) => {
    const response = await apiRequest("POST", "/api/chat", { message });
    return response.json();
  },

  getBookmarks: async () => {
    const response = await apiRequest("GET", "/api/bookmarks");
    return response.json();
  },

  addBookmark: async (articleId: string) => {
    const response = await apiRequest("POST", "/api/bookmarks", { articleId });
    return response.json();
  },

  removeBookmark: async (articleId: string) => {
    const response = await apiRequest("DELETE", `/api/bookmarks/${articleId}`);
    return response.json();
  },

  getBookmarkStatus: async (articleId: string) => {
    const response = await apiRequest("GET", `/api/bookmarks/${articleId}/status`);
    return response.json();
  },
};
