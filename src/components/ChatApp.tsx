
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import ChatSidebar from './ChatSidebar';
import Chat from './Chat';
import ChatHeader from './ChatHeader';
import SettingsModal from './SettingsModal';
import { useIsMobile } from "@/hooks/use-mobile";
import { ModelType } from '@/services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getChats, deleteChat } from '@/services/api';

// Define ChatSession interface for type safety
interface ChatSession {
  _id: string;
  title: string;
  model: ModelType;
}

const ChatApp = () => {
  const isMobile = useIsMobile();
  const [selectedModel, setSelectedModel] = useState<ModelType>('chatgpt');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | undefined>(undefined);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // State for API keys - using import.meta.env for Vite
  const [apiKeys, setApiKeys] = useState({
    openai: import.meta.env.VITE_OPENAI_API_KEY || '',
    gemini: import.meta.env.VITE_GEMINI_API_KEY || '',
    anthropic: import.meta.env.VITE_ANTHROPIC_API_KEY || '',
    grok: import.meta.env.VITE_GROK_API_KEY || ''
  });

  // Query for fetching chats
  const { 
    data: chats = [], 
    isLoading: isLoadingChats 
  } = useQuery({
    queryKey: ['chats'],
    queryFn: getChats,
    staleTime: 5000,
    refetchOnWindowFocus: true, 
  });

  // Mutation for deleting chats
  const deleteChatMutation = useMutation({
    mutationFn: (chatId: string) => deleteChat(chatId),
    onSuccess: () => {
      // Invalidate and refetch chats after deletion
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      
      toast({
        title: "Chat deleted",
        description: "The chat has been deleted successfully.",
      });
      
      // If the current chat was deleted, reset to new chat
      if (currentChatId && !chats.some(chat => chat._id === currentChatId)) {
        setCurrentChatId(undefined);
      }
    },
    onError: (error) => {
      toast({
        title: "Error deleting chat",
        description: error instanceof Error ? error.message : "Failed to delete chat",
        variant: "destructive",
      });
    },
  });

  const handleSaveApiKeys = (keys: typeof apiKeys) => {
    setApiKeys(keys);
    toast({
      title: "Settings saved",
      description: "Your API keys have been saved.",
    });
  };

  const handleNewChat = () => {
    // Start a new conversation
    setCurrentChatId(undefined);
    
    // Close the sidebar on mobile
    if (isMobile) {
      setIsSidebarOpen(false);
    }
    
    toast({
      title: "New chat started",
      description: "Your new conversation has begun.",
    });
  };

  const handleSelectModel = (model: ModelType) => {
    setSelectedModel(model);
  };

  const handleSelectChat = (chatId: string, model: ModelType) => {
    console.log("Selecting chat:", chatId, "with model:", model);
    setCurrentChatId(chatId);
    setSelectedModel(model);
    
    // Invalidate chat history to force refresh
    queryClient.invalidateQueries({ queryKey: ['chatHistory', chatId] });
    
    // Close sidebar on mobile after selecting a chat
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const handleDeleteChat = (chatId: string) => {
    deleteChatMutation.mutate(chatId);
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      <ChatHeader onOpenSettings={() => setIsSettingsOpen(true)} />
      
      <div className="flex flex-1 overflow-hidden">
        <ChatSidebar 
          selectedModel={selectedModel}
          onSelectModel={handleSelectModel}
          onNewChat={handleNewChat}
          isMobileSidebarOpen={isSidebarOpen}
          onCloseMobileSidebar={() => setIsSidebarOpen(false)}
          chats={chats}
          currentChatId={currentChatId}
          onSelectChat={handleSelectChat}
          onDeleteChat={handleDeleteChat}
          isLoading={isLoadingChats}
        />
        
        <div className="flex-1 overflow-hidden">
          <Chat 
            selectedModel={selectedModel}
            apiKeys={apiKeys}
            chatId={currentChatId}
            onChatIdChange={setCurrentChatId}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        </div>
      </div>
      
      <SettingsModal 
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        apiKeys={apiKeys}
        onSaveApiKeys={handleSaveApiKeys}
      />
    </div>
  );
};

export default ChatApp;
