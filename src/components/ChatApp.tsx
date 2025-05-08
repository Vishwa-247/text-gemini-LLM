
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import ChatSidebar from './ChatSidebar';
import Chat from './Chat';
import SettingsModal from './SettingsModal';
import { useIsMobile } from "@/hooks/use-mobile";

type AIModel = 'chatgpt' | 'gemini' | 'claude';

const ChatApp = () => {
  const isMobile = useIsMobile();
  const [selectedModel, setSelectedModel] = useState<AIModel>('chatgpt');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { toast } = useToast();

  // State for API keys - in a real app, these would be stored securely
  const [apiKeys, setApiKeys] = useState({
    openai: '',
    gemini: '',
    anthropic: '',
  });

  // Load API keys from localStorage on mount
  useEffect(() => {
    const savedKeys = localStorage.getItem('ai-api-keys');
    if (savedKeys) {
      try {
        setApiKeys(JSON.parse(savedKeys));
      } catch (e) {
        console.error('Failed to parse saved API keys:', e);
      }
    }
  }, []);

  const handleSaveApiKeys = (keys: typeof apiKeys) => {
    setApiKeys(keys);
    localStorage.setItem('ai-api-keys', JSON.stringify(keys));
    toast({
      title: "Settings saved",
      description: "Your API keys have been saved.",
    });
  };

  const handleNewChat = () => {
    // In a real app, this would start a new conversation
    // For now, we'll just close the sidebar on mobile
    if (isMobile) {
      setIsSidebarOpen(false);
    }
    
    // Show toast to indicate new chat started
    toast({
      title: "New chat started",
      description: "Your new conversation has begun.",
    });
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      <ChatSidebar 
        selectedModel={selectedModel}
        onSelectModel={setSelectedModel}
        onNewChat={handleNewChat}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isMobileSidebarOpen={isSidebarOpen}
        onCloseMobileSidebar={() => setIsSidebarOpen(false)}
      />
      
      <div className="flex-1">
        <Chat 
          selectedModel={selectedModel}
          apiKeys={apiKeys}
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
