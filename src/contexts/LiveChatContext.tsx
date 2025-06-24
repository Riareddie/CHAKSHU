import React, { createContext, useContext, useState } from "react";

interface LiveChatContextType {
  isLiveChatOpen: boolean;
  openLiveChat: () => void;
  closeLiveChat: () => void;
}

const LiveChatContext = createContext<LiveChatContextType | undefined>(
  undefined,
);

export const useLiveChat = () => {
  const context = useContext(LiveChatContext);
  if (context === undefined) {
    throw new Error("useLiveChat must be used within a LiveChatProvider");
  }
  return context;
};

interface LiveChatProviderProps {
  children: React.ReactNode;
}

export const LiveChatProvider: React.FC<LiveChatProviderProps> = ({
  children,
}) => {
  const [isLiveChatOpen, setIsLiveChatOpen] = useState(false);

  const openLiveChat = () => {
    setIsLiveChatOpen(true);
  };

  const closeLiveChat = () => {
    setIsLiveChatOpen(false);
  };

  const value = {
    isLiveChatOpen,
    openLiveChat,
    closeLiveChat,
  };

  return (
    <LiveChatContext.Provider value={value}>
      {children}
    </LiveChatContext.Provider>
  );
};
