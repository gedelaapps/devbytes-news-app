import { useState, useEffect } from "react";
import { AppHeader } from "@/components/app-header";
import { CategoryFilter } from "@/components/category-filter";
import { NewsGrid } from "@/components/news-grid";
import { AIChatAssistant } from "@/components/ai-chat-assistant";
import type { NewsCategory } from "@shared/schema";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  const handleCategoryChange = (category: NewsCategory) => {
    setSelectedCategory(category);
    setSearchTerm(""); // Clear search when changing category
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[hsl(215,28%,7%)] text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <AppHeader
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onChatToggle={toggleChat}
        isChatOpen={isChatOpen}
      />
      
      <CategoryFilter
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />
      
      <NewsGrid
        category={selectedCategory}
        searchTerm={debouncedSearch}
      />
      
      <AIChatAssistant
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  );
}
