
import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquare, Plus, Settings } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatSidebarItem from './ChatSidebarItem';
import { ModelType } from '@/services/api';
import { useSidebarItemAnimation } from '@/hooks/use-gsap-animations';

export interface ChatSession {
  _id: string;
  title: string;
  model: ModelType;
}

interface ChatSidebarProps {
  selectedModel: ModelType;
  onSelectModel: (model: ModelType) => void;
  onNewChat: () => void;
  onOpenSettings: () => void;
  isMobileSidebarOpen: boolean;
  onCloseMobileSidebar: () => void;
  chats: ChatSession[];
  currentChatId?: string;
  onSelectChat: (chatId: string, model: ModelType) => void;
  onDeleteChat: (chatId: string) => void;
  isLoading: boolean;
}

const models: {id: ModelType; name: string; icon: string}[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    icon: '🤖'
  },
  {
    id: 'gemini',
    name: 'Gemini',
    icon: '🔮'
  },
  {
    id: 'claude',
    name: 'Claude',
    icon: '🧠'
  }
];

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  selectedModel,
  onSelectModel,
  onNewChat,
  onOpenSettings,
  isMobileSidebarOpen,
  onCloseMobileSidebar,
  chats,
  currentChatId,
  onSelectChat,
  onDeleteChat,
  isLoading
}) => {
  // Use animation hook to animate sidebar items
  useSidebarItemAnimation('.sidebar-item-appear', 0.2);

  return (
    <>
      <div 
        className={`fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden ${
          isMobileSidebarOpen ? 'block' : 'hidden'
        }`}
        onClick={onCloseMobileSidebar}
      />
      <aside 
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-sidebar border-r border-sidebar-border flex flex-col
          transition-transform duration-300 ease-in-out
          ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:relative lg:z-0
        `}
      >
        <div className="p-4">
          <Button 
            variant="outline" 
            className="w-full justify-start gap-2 bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/80 sidebar-item-appear"
            onClick={onNewChat}
          >
            <Plus className="w-4 h-4" />
            New chat
          </Button>
        </div>
        
        <div className="px-2 py-2 sidebar-item-appear">
          <h2 className="px-2 text-lg font-semibold">Select Model</h2>
          <div className="mt-2 space-y-1">
            {models.map((model) => (
              <Button
                key={model.id}
                variant={selectedModel === model.id ? "secondary" : "ghost"}
                className="w-full justify-start gap-2 sidebar-item-appear"
                onClick={() => onSelectModel(model.id)}
              >
                <span className="text-lg">{model.icon}</span>
                {model.name}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="px-2 py-2 sidebar-item-appear">
          <h2 className="px-2 text-lg font-semibold">Chat History</h2>
          <ScrollArea className="h-[400px] mt-2">
            <div className="space-y-1 pr-2">
              {isLoading ? (
                <div className="flex items-center justify-center p-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : chats.length === 0 ? (
                <p className="text-center text-muted-foreground p-2">No chat history</p>
              ) : (
                chats.map((chat, index) => (
                  <ChatSidebarItem 
                    key={chat._id}
                    id={chat._id}
                    title={chat.title}
                    model={chat.model}
                    isActive={currentChatId === chat._id}
                    onClick={() => onSelectChat(chat._id, chat.model)}
                    onDelete={() => onDeleteChat(chat._id)}
                    animationDelay={index * 0.05}
                  />
                ))
              )}
            </div>
          </ScrollArea>
        </div>
        
        <div className="mt-auto p-4 border-t border-sidebar-border sidebar-item-appear">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-2"
            onClick={onOpenSettings}
          >
            <Settings className="w-4 h-4" />
            Settings
          </Button>
        </div>
      </aside>
    </>
  );
};

export default ChatSidebar;
