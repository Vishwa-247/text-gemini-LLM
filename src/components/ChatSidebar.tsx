
import * as React from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquare, Plus, Settings, PlusCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatSidebarItem from './ChatSidebarItem';
import { ModelType } from '@/services/api';
import { useSidebarItemAnimation } from '@/hooks/use-gsap-animations';
import CustomModelForm from './CustomModelForm';
import { Separator } from "@/components/ui/separator";

export interface ChatSession {
  _id: string;
  title: string;
  model: ModelType;
}

interface CustomModel {
  name: string;
  id: string;
  apiEndpoint: string;
  apiKey: string;
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

const defaultModels = [
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
  const [customModels, setCustomModels] = React.useState<CustomModel[]>([]);
  const [isAddModelOpen, setIsAddModelOpen] = React.useState(false);

  // Load custom models from localStorage
  React.useEffect(() => {
    const savedModels = localStorage.getItem('custom-models');
    if (savedModels) {
      try {
        setCustomModels(JSON.parse(savedModels));
      } catch (e) {
        console.error('Failed to load custom models:', e);
      }
    }
  }, []);

  // Save custom models to localStorage
  const saveCustomModel = (model: CustomModel) => {
    const updatedModels = [...customModels, model];
    setCustomModels(updatedModels);
    localStorage.setItem('custom-models', JSON.stringify(updatedModels));
  };

  // Combined models
  const allModels = [
    ...defaultModels,
    ...customModels.map(model => ({
      id: model.id as ModelType,
      name: model.name,
      icon: '⚙️'
    }))
  ];

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
          fixed top-0 left-0 z-50 h-full w-[280px] bg-sidebar border-r border-sidebar-border flex flex-col
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
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-semibold">Models</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={() => setIsAddModelOpen(true)}
            >
              <PlusCircle className="h-4 w-4" />
              <span className="sr-only">Add custom model</span>
            </Button>
          </div>
          <div className="mt-2 space-y-1">
            {allModels.map((model) => (
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
        
        <Separator className="my-2" />
        
        <div className="px-2 py-2 sidebar-item-appear flex-1 overflow-hidden flex flex-col">
          <h2 className="px-2 text-lg font-semibold">Chat History</h2>
          <ScrollArea className="flex-1 mt-2 pr-2">
            <div className="space-y-1">
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
      
      <CustomModelForm
        open={isAddModelOpen}
        onOpenChange={setIsAddModelOpen}
        onSave={saveCustomModel}
      />
    </>
  );
};

export default ChatSidebar;
