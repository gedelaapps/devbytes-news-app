import { useState } from "react";
import { Search, MessageCircle, Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/hooks/use-theme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AppHeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onChatToggle: () => void;
  isChatOpen: boolean;
}

export function AppHeader({ searchTerm, onSearchChange, onChatToggle, isChatOpen }: AppHeaderProps) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-[hsl(215,28%,7%)]/95 backdrop-blur-sm border-b border-[hsl(220,13%,91%)] dark:border-[hsl(220,13%,18%)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[hsl(207,90%,54%)] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">D</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">DevBytes</h1>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[hsl(210,40%,98%)] dark:bg-[hsl(220,13%,13%)] border border-[hsl(220,13%,91%)] dark:border-[hsl(220,13%,18%)] rounded-lg focus:ring-2 focus:ring-[hsl(207,90%,54%)] focus:border-transparent transition-colors"
              />
              <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 rounded-lg bg-[hsl(210,40%,98%)] dark:bg-[hsl(220,13%,13%)] border border-[hsl(220,13%,91%)] dark:border-[hsl(220,13%,18%)] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {theme === "light" && <Sun className="w-5 h-5" />}
                  {theme === "dark" && <Moon className="w-5 h-5" />}
                  {theme === "system" && <Monitor className="w-5 h-5" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  <Sun className="mr-2 h-4 w-4" />
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  <Moon className="mr-2 h-4 w-4" />
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  <Monitor className="mr-2 h-4 w-4" />
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Chat Toggle */}
            <Button
              onClick={onChatToggle}
              className="p-2 rounded-lg bg-[hsl(207,90%,54%)] text-white hover:bg-blue-700 transition-colors relative"
            >
              <MessageCircle className="w-5 h-5" />
              {isChatOpen && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-[hsl(158,64%,52%)] rounded-full"></span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
