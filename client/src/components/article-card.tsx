import { useState } from "react";
import { ExternalLink, FileText, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Article } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { newsAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface ArticleCardProps {
  article: Article;
  onTLDRClick: (article: Article) => void;
}

const categoryColors: Record<string, string> = {
  ai: "bg-[hsl(207,90%,54%)]/10 text-[hsl(207,90%,54%)]",
  programming: "bg-[hsl(158,64%,52%)]/10 text-[hsl(158,64%,52%)]",
  startups: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  cloud: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  cybersecurity: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  devops: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  all: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
};

export function ArticleCard({ article, onTLDRClick }: ArticleCardProps) {
  const [bookmarkedArticles, setBookmarkedArticles] = useLocalStorage<string[]>("bookmarked-articles", []);
  const isBookmarked = bookmarkedArticles.includes(article.id);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const bookmarkMutation = useMutation({
    mutationFn: async (articleId: string) => {
      if (isBookmarked) {
        await newsAPI.removeBookmark(articleId);
        return { action: "removed" };
      } else {
        await newsAPI.addBookmark(articleId);
        return { action: "added" };
      }
    },
    onSuccess: (data) => {
      if (data.action === "added") {
        setBookmarkedArticles([...bookmarkedArticles, article.id]);
        toast({
          title: "Bookmarked",
          description: "Article saved to your bookmarks",
        });
      } else {
        setBookmarkedArticles(bookmarkedArticles.filter(id => id !== article.id));
        toast({
          title: "Bookmark removed",
          description: "Article removed from your bookmarks",
        });
      }
      queryClient.invalidateQueries({ queryKey: ["/api/bookmarks"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update bookmark",
        variant: "destructive",
      });
    },
  });

  const handleBookmarkToggle = () => {
    bookmarkMutation.mutate(article.id);
  };

  const formatPublishedDate = (date: Date | string) => {
    const publishedDate = typeof date === "string" ? new Date(date) : date;
    return formatDistanceToNow(publishedDate, { addSuffix: true });
  };

  const getCategoryColor = (category: string) => {
    return categoryColors[category.toLowerCase()] || categoryColors.all;
  };

  return (
    <article className="bg-[hsl(210,40%,98%)] dark:bg-[hsl(220,13%,13%)] rounded-xl border border-[hsl(220,13%,91%)] dark:border-[hsl(220,13%,18%)] hover:shadow-lg transition-shadow duration-200">
      <div className="p-6">
        {/* Article Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Badge className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(article.category)}`}>
              {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
            </Badge>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatPublishedDate(article.publishedAt)}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBookmarkToggle}
            disabled={bookmarkMutation.isPending}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Bookmark 
              className={`w-4 h-4 transition-colors ${
                isBookmarked 
                  ? "fill-[hsl(158,64%,52%)] text-[hsl(158,64%,52%)]" 
                  : "text-gray-400 hover:text-[hsl(158,64%,52%)]"
              }`} 
            />
          </Button>
        </div>

        {/* Article Title */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2 hover:text-[hsl(207,90%,54%)] transition-colors cursor-pointer">
          {article.title}
        </h3>

        {/* Article Description */}
        {article.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
            {article.description}
          </p>
        )}

        {/* Article Source */}
        <div className="flex items-center mb-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {article.source}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[hsl(207,90%,54%)] hover:text-blue-700 text-sm font-medium flex items-center space-x-1 transition-colors"
          >
            <span>Read Article</span>
            <ExternalLink className="w-4 h-4" />
          </a>
          <Button
            onClick={() => onTLDRClick(article)}
            variant="ghost"
            size="sm"
            className="px-3 py-1.5 bg-[hsl(250,84%,67%)]/10 text-[hsl(250,84%,67%)] hover:bg-[hsl(250,84%,67%)]/20 text-sm font-medium rounded-lg transition-colors flex items-center space-x-1"
          >
            <FileText className="w-4 h-4" />
            <span>TL;DR</span>
          </Button>
        </div>
      </div>
    </article>
  );
}
