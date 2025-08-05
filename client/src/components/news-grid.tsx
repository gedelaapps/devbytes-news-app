import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArticleCard } from "./article-card";
import { TLDRModal } from "@/components/tldr-modal";
import { newsAPI } from "@/lib/api";
import type { Article, NewsCategory } from "@shared/schema";

interface NewsGridProps {
  category: NewsCategory;
  searchTerm: string;
}

export function NewsGrid({ category, searchTerm }: NewsGridProps) {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [showTLDRModal, setShowTLDRModal] = useState(false);
  const [limit, setLimit] = useState(20);

  const {
    data: articles = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["/api/news", category, searchTerm, limit],
    queryFn: () => newsAPI.getNews(category, searchTerm, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleTLDRClick = (article: Article) => {
    setSelectedArticle(article);
    setShowTLDRModal(true);
  };

  const handleLoadMore = () => {
    setLimit(prev => prev + 20);
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Failed to load articles</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error instanceof Error ? error.message : "An error occurred while fetching articles"}
          </p>
          <Button onClick={() => refetch()} className="flex items-center space-x-2">
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-[hsl(210,40%,98%)] dark:bg-[hsl(220,13%,13%)] rounded-xl border border-[hsl(220,13%,91%)] dark:border-[hsl(220,13%,18%)] p-6">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-4 w-12" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <div className="mt-4">
                <Skeleton className="h-3 w-20" />
              </div>
              <div className="flex items-center justify-between mt-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {articles.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No articles found</h2>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm 
                ? `No articles found matching "${searchTerm}"`
                : "No articles available for this category"
              }
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onTLDRClick={handleTLDRClick}
                />
              ))}
            </div>

            {/* Load More Button */}
            {articles.length >= limit && (
              <div className="text-center mt-12">
                <Button
                  onClick={handleLoadMore}
                  className="px-6 py-3 bg-[hsl(207,90%,54%)] text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2 mx-auto"
                >
                  <span>Load More Articles</span>
                  <RefreshCw className="w-5 h-5" />
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      {/* TL;DR Modal */}
      {selectedArticle && (
        <TLDRModal
          article={selectedArticle}
          isOpen={showTLDRModal}
          onClose={() => {
            setShowTLDRModal(false);
            setSelectedArticle(null);
          }}
        />
      )}
    </>
  );
}
