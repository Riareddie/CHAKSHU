import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, X } from "lucide-react";
import { useLiveChat } from "@/contexts/LiveChatContext";
import { useToast } from "@/hooks/use-toast";

const FloatingLiveChatButton = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  const { openLiveChat } = useLiveChat();
  const { toast } = useToast();

  const handleOpenChat = () => {
    openLiveChat();
    toast({
      title: "Live Chat",
      description: "Opening live support chat...",
    });
  };

  if (isMinimized) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-2">
      {/* Chat prompt bubble */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 mr-2 max-w-xs animate-fade-in">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 mb-1">
              Need help with fraud reporting?
            </p>
            <p className="text-xs text-gray-600">
              Chat with our support team for instant assistance
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(true)}
            className="h-6 w-6 p-0 ml-2"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Main chat button */}
      <Button
        onClick={handleOpenChat}
        className="h-14 w-14 rounded-full bg-india-saffron hover:bg-saffron-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        size="icon"
      >
        <MessageSquare className="h-6 w-6" />
        <span className="sr-only">Open live chat support</span>
      </Button>

      {/* Online indicator */}
      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
    </div>
  );
};

export default FloatingLiveChatButton;
