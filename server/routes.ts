import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertArticleSchema, insertSummarySchema, insertBookmarkSchema, type NewsCategory } from "@shared/schema";
import axios from "axios";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // GNews API configuration
  const GNEWS_API_KEY = process.env.GNEWS_API_KEY || process.env.VITE_GNEWS_API_KEY || "";
  const GNEWS_BASE_URL = "https://gnews.io/api/v4";
  
  // Mistral API configuration for AI features
  const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY || process.env.VITE_MISTRAL_API_KEY || "";
  const MISTRAL_BASE_URL = "https://api.mistral.ai/v1";

  // Map categories to search terms
  const categorySearchTerms: Record<NewsCategory, string> = {
    all: "technology OR programming OR AI OR startups OR cloud OR cybersecurity OR devops",
    ai: "artificial intelligence OR machine learning OR AI OR neural networks",
    programming: "programming OR software development OR coding OR javascript OR python OR react",
    startups: "startups OR venture capital OR tech funding OR unicorn companies",
    cloud: "cloud computing OR AWS OR Azure OR Google Cloud OR serverless",
    cybersecurity: "cybersecurity OR security breach OR hacking OR data protection",
    devops: "devops OR kubernetes OR docker OR CI/CD OR infrastructure"
  };

  // Cache for storing last fetch time per category to avoid rate limits
  const lastFetchTime: Record<string, number> = {};
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

  // Fetch news from GNews API
  app.get("/api/news", async (req, res) => {
    try {
      const { category = "all", search, limit = "20", offset = "0" } = req.query;
      const cacheKey = `${category}_${search || ''}`;
      const now = Date.now();
      
      // Check if articles are already cached in storage
      const cachedArticles = await storage.getArticles(
        category as string,
        search as string,
        parseInt(limit as string),
        parseInt(offset as string)
      );
      
      // Return cached articles if we have them and they're recent enough, or if we're within rate limit cooldown
      const lastFetch = lastFetchTime[cacheKey] || 0;
      const shouldUseCached = cachedArticles.length > 0 && (now - lastFetch < CACHE_DURATION);
      
      if (shouldUseCached) {
        return res.json(cachedArticles);
      }
      
      // Check if we're hitting rate limits (too many requests recently)
      if (now - lastFetch < 10000) { // 10 second cooldown between API calls for same category
        if (cachedArticles.length > 0) {
          return res.json(cachedArticles);
        }
        return res.status(429).json({ 
          message: "Rate limit protection active. Please try again in a moment.",
          cached: false
        });
      }
      
      // Fetch fresh articles from GNews API
      const searchTerm = search || categorySearchTerms[category as NewsCategory] || categorySearchTerms.all;
      
      // Record the fetch attempt
      lastFetchTime[cacheKey] = now;
      
      const response = await axios.get(`${GNEWS_BASE_URL}/search`, {
        params: {
          q: searchTerm,
          token: GNEWS_API_KEY,
          lang: "en",
          country: "us",
          max: parseInt(limit as string),
          sortby: "publishedAt"
        }
      });

      const articles = response.data.articles?.map((article: any) => ({
        id: `gnews_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: article.title,
        description: article.description,
        url: article.url,
        urlToImage: article.image,
        publishedAt: new Date(article.publishedAt),
        source: article.source?.name || "Unknown",
        category: category as string,
        content: article.content
      })) || [];

      // Store articles in memory
      if (articles.length > 0) {
        await storage.createArticles(articles);
      }

      res.json(articles);
    } catch (error: any) {
      console.error("Error fetching news:", error.message);
      
      // If we hit rate limits or API errors, try to return cached articles as fallback
      const cachedArticles = await storage.getArticles(
        req.query.category as string,
        req.query.search as string,
        parseInt(req.query.limit as string || "20"),
        parseInt(req.query.offset as string || "0")
      );
      
      if (cachedArticles.length > 0) {
        return res.json(cachedArticles);
      }
      
      // If all else fails, return appropriate error
      const status = error.response?.status === 400 ? 429 : 500;
      const message = error.response?.status === 400 
        ? "GNews API rate limit reached. The free tier allows limited requests per day. Try other categories or wait for the limit to reset." 
        : "Failed to fetch news articles";
        
      res.status(status).json({ 
        message,
        error: error.response?.data?.message || error.message,
        cached: false
      });
    }
  });

  // Get article by ID
  app.get("/api/articles/:id", async (req, res) => {
    try {
      const article = await storage.getArticle(req.params.id);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json(article);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Generate TL;DR summary for an article
  app.post("/api/articles/:id/summary", async (req, res) => {
    try {
      const articleId = req.params.id;
      
      // Check if summary already exists
      const existingSummary = await storage.getSummary(articleId);
      if (existingSummary) {
        return res.json(existingSummary);
      }

      // Get the article
      const article = await storage.getArticle(articleId);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }

      // Generate summary using Mistral API
      let summaryText = "";
      
      if (MISTRAL_API_KEY) {
        try {
          const response = await axios.post(
            `${MISTRAL_BASE_URL}/chat/completions`,
            {
              model: "mistral-tiny",
              messages: [
                {
                  role: "user",
                  content: `Please provide a concise TL;DR summary of this article in bullet points (3-4 points max). Focus on the key technical details and main takeaways for developers:

Title: ${article.title}
Description: ${article.description || ""}
Content: ${article.content || ""}`
                }
              ],
              max_tokens: 200,
              temperature: 0.3
            },
            {
              headers: {
                "Authorization": `Bearer ${MISTRAL_API_KEY}`,
                "Content-Type": "application/json"
              }
            }
          );
          
          summaryText = response.data.choices[0]?.message?.content || "Summary generation failed";
        } catch (apiError) {
          console.error("Mistral API error:", apiError);
          // Fallback to basic summary extraction
          summaryText = generateFallbackSummary(article);
        }
      } else {
        // Fallback summary when no API key available
        summaryText = generateFallbackSummary(article);
      }

      // Save summary
      const summary = await storage.createSummary({
        articleId,
        summary: summaryText
      });

      res.json(summary);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // AI Chat Assistant
  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;
      
      if (!message || typeof message !== "string") {
        return res.status(400).json({ message: "Message is required" });
      }

      let responseText = "";

      if (MISTRAL_API_KEY) {
        try {
          const response = await axios.post(
            `${MISTRAL_BASE_URL}/chat/completions`,
            {
              model: "mistral-tiny",
              messages: [
                {
                  role: "system",
                  content: "You are a helpful coding assistant for developers. Provide concise, practical answers about programming, debugging, and software development. Include code examples when relevant."
                },
                {
                  role: "user",
                  content: message
                }
              ],
              max_tokens: 500,
              temperature: 0.7
            },
            {
              headers: {
                "Authorization": `Bearer ${MISTRAL_API_KEY}`,
                "Content-Type": "application/json"
              }
            }
          );
          
          responseText = response.data.choices[0]?.message?.content || "I'm sorry, I couldn't process your request.";
        } catch (apiError) {
          console.error("Mistral API error:", apiError);
          responseText = generateFallbackChatResponse(message);
        }
      } else {
        responseText = generateFallbackChatResponse(message);
      }

      res.json({ response: responseText });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Bookmark management
  app.get("/api/bookmarks", async (req, res) => {
    try {
      const bookmarks = await storage.getBookmarks();
      const bookmarkedArticles = [];
      
      for (const bookmark of bookmarks) {
        const article = await storage.getArticle(bookmark.articleId);
        if (article) {
          bookmarkedArticles.push({
            ...article,
            bookmarkedAt: bookmark.createdAt
          });
        }
      }
      
      res.json(bookmarkedArticles);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/bookmarks", async (req, res) => {
    try {
      const validatedData = insertBookmarkSchema.parse(req.body);
      const bookmark = await storage.createBookmark(validatedData);
      res.json(bookmark);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid bookmark data", errors: error.errors });
      }
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/bookmarks/:articleId", async (req, res) => {
    try {
      const success = await storage.deleteBookmark(req.params.articleId);
      if (!success) {
        return res.status(404).json({ message: "Bookmark not found" });
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/bookmarks/:articleId/status", async (req, res) => {
    try {
      const isBookmarked = await storage.isBookmarked(req.params.articleId);
      res.json({ isBookmarked });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Fallback functions when APIs are not available
function generateFallbackSummary(article: any): string {
  const points = [];
  
  if (article.title) {
    points.push(`• ${article.title.split(':')[0]}`);
  }
  
  if (article.description) {
    const sentences = article.description.split('.').filter((s: string) => s.trim().length > 20);
    points.push(...sentences.slice(0, 2).map((s: string) => `• ${s.trim()}`));
  }
  
  if (points.length === 0) {
    points.push("• Article summary is not available at this time");
  }
  
  return points.join('\n');
}

function generateFallbackChatResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('react') || lowerMessage.includes('jsx')) {
    return "For React development, I recommend checking the official React documentation at reactjs.org. Common patterns include using hooks like useState and useEffect for state management.";
  }
  
  if (lowerMessage.includes('javascript') || lowerMessage.includes('js')) {
    return "JavaScript is a versatile language. For modern development, consider using ES6+ features like arrow functions, destructuring, and async/await for cleaner code.";
  }
  
  if (lowerMessage.includes('css') || lowerMessage.includes('styling')) {
    return "For CSS, consider using Flexbox or Grid for layouts, and CSS variables for maintainable theming. Tailwind CSS is also great for utility-first styling.";
  }
  
  if (lowerMessage.includes('api') || lowerMessage.includes('fetch')) {
    return "For API calls, use fetch() with async/await or libraries like axios. Always handle errors and loading states in your UI.";
  }
  
  return "I'm a coding assistant here to help with programming questions. Feel free to ask about React, JavaScript, CSS, APIs, or other development topics!";
}
