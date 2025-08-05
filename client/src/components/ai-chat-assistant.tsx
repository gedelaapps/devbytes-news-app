import { useState, useRef, useEffect } from "react";
import { X, Send, Lightbulb, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMutation } from "@tanstack/react-query";
import { newsAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import type { ChatMessage } from "@shared/schema";

interface AIChatAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIChatAssistant({ isOpen, onClose }: AIChatAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi! I'm your coding assistant. Ask me about programming, debugging, or any tech questions you have!",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const chatMutation = useMutation({
    mutationFn: (message: string) => newsAPI.sendChatMessage(message),
    onSuccess: (data, variables) => {
      // Add user message
      const userMessage: ChatMessage = {
        id: `user_${Date.now()}`,
        role: "user",
        content: variables,
        timestamp: new Date(),
      };

      // Add assistant response
      const assistantMessage: ChatMessage = {
        id: `assistant_${Date.now()}`,
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, userMessage, assistantMessage]);
      setInputMessage("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (!inputMessage.trim() || chatMutation.isPending) return;
    
    chatMutation.mutate(inputMessage.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="w-80 h-96 bg-white dark:bg-[hsl(220,13%,13%)] rounded-xl shadow-2xl border border-[hsl(220,13%,91%)] dark:border-[hsl(220,13%,18%)] flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-[hsl(220,13%,91%)] dark:border-[hsl(220,13%,18%)] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[hsl(250,84%,67%)] rounded-full flex items-center justify-center">
              <Lightbulb className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">AI Assistant</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Ask coding questions</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </Button>
        </div>

        {/* Chat Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-2 ${
                  message.role === "user" ? "justify-end" : ""
                }`}
              >
                {message.role === "assistant" && (
                  <div className="w-6 h-6 bg-[hsl(250,84%,67%)] rounded-full flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-3 h-3 text-white" />
                  </div>
                )}
                
                <div
                  className={`p-3 rounded-lg max-w-xs ${
                    message.role === "user"
                      ? "bg-[hsl(207,90%,54%)] text-white"
                      : "bg-[hsl(210,40%,98%)] dark:bg-[hsl(215,28%,7%)] text-gray-900 dark:text-white"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>

                {message.role === "user" && (
                  <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
            ))}
            
            {chatMutation.isPending && (
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-[hsl(250,84%,67%)] rounded-full flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-3 h-3 text-white" />
                </div>
                <div className="bg-[hsl(210,40%,98%)] dark:bg-[hsl(215,28%,7%)] p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Chat Input */}
        <div className="p-4 border-t border-[hsl(220,13%,91%)] dark:border-[hsl(220,13%,18%)]">
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Ask a coding question..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={chatMutation.isPending}
              className="flex-1 px-3 py-2 bg-[hsl(210,40%,98%)] dark:bg-[hsl(215,28%,7%)] border border-[hsl(220,13%,91%)] dark:border-[hsl(220,13%,18%)] rounded-lg focus:ring-2 focus:ring-[hsl(250,84%,67%)] focus:border-transparent text-sm"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || chatMutation.isPending}
              className="p-2 bg-[hsl(250,84%,67%)] text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
