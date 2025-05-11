
import * as React from 'react';
import { Separator } from "@/components/ui/separator";
import { ModelType } from '@/services/api';
import { useSidebarItemAnimation } from '@/hooks/use-gsap-animations';
import CustomModelForm from './CustomModelForm';
import NewChatButton from './sidebar/NewChatButton';
import ModelSelector from './sidebar/ModelSelector';
import ChatHistoryList from './sidebar/ChatHistoryList';
import SidebarFooter from './sidebar/SidebarFooter';
import { SidebarProvider, ChatSession } from './sidebar/SidebarProvider';
import { useSidebar } from './sidebar/SidebarProvider';

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

const ChatSidebarContent: React.FC<ChatSidebarProps> = ({
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
  const { isAddModelOpen, setIsAddModelOpen, customModels, saveCustomModel } = useSidebar();

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
        <NewChatButton onClick={onNewChat} />
        
        <ModelSelector 
          selectedModel={selectedModel} 
          onSelectModel={onSelectModel} 
          onAddModel={() => setIsAddModelOpen(true)}
          customModels={customModels}
        />
        
        <Separator className="my-2" />
        
        <ChatHistoryList 
          chats={chats}
          currentChatId={currentChatId}
          onSelectChat={onSelectChat}
          onDeleteChat={onDeleteChat}
          isLoading={isLoading}
        />
        
        <SidebarFooter onOpenSettings={onOpenSettings} />
      </aside>
      
      <CustomModelForm
        open={isAddModelOpen}
        onOpenChange={setIsAddModelOpen}
        onSave={saveCustomModel}
      />
    </>
  );
};

const ChatSidebar: React.FC<ChatSidebarProps> = (props) => {
  return (
    <SidebarProvider>
      <ChatSidebarContent {...props} />
    </SidebarProvider>
  );
};

export default ChatSidebar;
