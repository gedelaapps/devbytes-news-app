import { Button } from "@/components/ui/button";
import type { NewsCategory } from "@shared/schema";

interface CategoryFilterProps {
  selectedCategory: NewsCategory;
  onCategoryChange: (category: NewsCategory) => void;
}

const categories: { value: NewsCategory; label: string; color: string }[] = [
  { value: "all", label: "All", color: "bg-[hsl(207,90%,54%)] text-white" },
  { value: "ai", label: "AI", color: "bg-[hsl(210,40%,98%)] dark:bg-[hsl(220,13%,13%)] text-gray-700 dark:text-gray-300 border border-[hsl(220,13%,91%)] dark:border-[hsl(220,13%,18%)] hover:bg-gray-100 dark:hover:bg-gray-800" },
  { value: "programming", label: "Programming", color: "bg-[hsl(210,40%,98%)] dark:bg-[hsl(220,13%,13%)] text-gray-700 dark:text-gray-300 border border-[hsl(220,13%,91%)] dark:border-[hsl(220,13%,18%)] hover:bg-gray-100 dark:hover:bg-gray-800" },
  { value: "startups", label: "Startups", color: "bg-[hsl(210,40%,98%)] dark:bg-[hsl(220,13%,13%)] text-gray-700 dark:text-gray-300 border border-[hsl(220,13%,91%)] dark:border-[hsl(220,13%,18%)] hover:bg-gray-100 dark:hover:bg-gray-800" },
  { value: "cloud", label: "Cloud", color: "bg-[hsl(210,40%,98%)] dark:bg-[hsl(220,13%,13%)] text-gray-700 dark:text-gray-300 border border-[hsl(220,13%,91%)] dark:border-[hsl(220,13%,18%)] hover:bg-gray-100 dark:hover:bg-gray-800" },
  { value: "cybersecurity", label: "Cybersecurity", color: "bg-[hsl(210,40%,98%)] dark:bg-[hsl(220,13%,13%)] text-gray-700 dark:text-gray-300 border border-[hsl(220,13%,91%)] dark:border-[hsl(220,13%,18%)] hover:bg-gray-100 dark:hover:bg-gray-800" },
  { value: "devops", label: "DevOps", color: "bg-[hsl(210,40%,98%)] dark:bg-[hsl(220,13%,13%)] text-gray-700 dark:text-gray-300 border border-[hsl(220,13%,91%)] dark:border-[hsl(220,13%,18%)] hover:bg-gray-100 dark:hover:bg-gray-800" },
];

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="bg-white dark:bg-[hsl(215,28%,7%)] border-b border-[hsl(220,13%,91%)] dark:border-[hsl(220,13%,18%)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-3 py-4 overflow-x-auto">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">Categories:</span>
          {categories.map((category) => (
            <Button
              key={category.value}
              onClick={() => onCategoryChange(category.value)}
              variant="ghost"
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category.value
                  ? "bg-[hsl(207,90%,54%)] text-white"
                  : "bg-[hsl(210,40%,98%)] dark:bg-[hsl(220,13%,13%)] text-gray-700 dark:text-gray-300 border border-[hsl(220,13%,91%)] dark:border-[hsl(220,13%,18%)] hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
