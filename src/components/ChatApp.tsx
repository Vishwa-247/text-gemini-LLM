
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import ChatSidebar from './ChatSidebar';
import Chat from './Chat';
import SettingsModal from './SettingsModal';
import { useIsMobile } from "@/hooks/use-mobile";
import { getChats, deleteChat, ModelType } from '@/services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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

  // State for API keys - in a real app, these would be stored securely
  const [apiKeys, setApiKeys] = useState({
    openai: process.env.OPENAI_API_KEY || '',
    gemini: process.env.GEMINI_API_KEY || '',
    anthropic: process.env.ANTHROPIC_API_KEY || '',
    grok: process.env.GROK_API_KEY || ''
  });

  // Query for fetching chats with staleTime to prevent unnecessary loading
  const { data: chats = [], isLoading: isLoadingChats, refetch: refetchChats } = useQuery({
    queryKey: ['chats'],
    queryFn: getChats,
    staleTime: 5000, // 5 seconds - reduced to help with testing
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
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <ChatSidebar 
        selectedModel={selectedModel}
        onSelectModel={handleSelectModel}
        onNewChat={handleNewChat}
        onOpenSettings={() => setIsSettingsOpen(true)}
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
