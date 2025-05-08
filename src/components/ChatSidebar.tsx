
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquare, Plus, Settings, Users } from "lucide-react";

type AIModel = 'chatgpt' | 'gemini' | 'claude';

interface ModelOption {
  id: AIModel;
  name: string;
  icon: React.ReactNode;
}

const models: ModelOption[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    icon: <MessageSquare className="w-4 h-4" />
  },
  {
    id: 'gemini',
    name: 'Gemini',
    icon: <MessageSquare className="w-4 h-4" />
  },
  {
    id: 'claude',
    name: 'Claude',
    icon: <MessageSquare className="w-4 h-4" />
  }
];

interface ChatSidebarProps {
  selectedModel: AIModel;
  onSelectModel: (model: AIModel) => void;
  onNewChat: () => void;
  onOpenSettings: () => void;
  isMobileSidebarOpen: boolean;
  onCloseMobileSidebar: () => void;
}

const ChatSidebar = ({
  selectedModel,
  onSelectModel,
  onNewChat,
  onOpenSettings,
  isMobileSidebarOpen,
  onCloseMobileSidebar
}: ChatSidebarProps) => {
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
            className="w-full justify-start gap-2 bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/80"
            onClick={onNewChat}
          >
            <Plus className="w-4 h-4" />
            New chat
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto scrollbar-custom p-2">
          <div className="space-y-2">
            {models.map((model) => (
              <Button
                key={model.id}
                variant={selectedModel === model.id ? "secondary" : "ghost"}
                className="w-full justify-start gap-2"
                onClick={() => onSelectModel(model.id)}
              >
                {model.icon}
                {model.name}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="p-4 border-t border-sidebar-border">
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
