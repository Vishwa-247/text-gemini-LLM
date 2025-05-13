
import * as React from 'react';
import { nanoid } from 'nanoid';
import ChatMessage, { Message, MessageRole } from './ChatMessage';
import ChatInput from './ChatInput';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { MessageSquare, Menu } from "lucide-react";
import { sendChatMessage, getChatHistory, ModelType } from "@/services/api";
import ThemeSelector from './ThemeSelector';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEmptyStateAnimation, useScrollToBottom } from '@/hooks/use-gsap-animations';

interface ChatProps {
  selectedModel: ModelType;
  apiKeys: {
    openai: string;
    gemini: string;
    anthropic: string;
    grok: string;
  };
  chatId?: string;
  onChatIdChange: (chatId: string) => void;
  onToggleSidebar: () => void;
}

const modelNames: Record<string, string> = {
  'chatgpt': 'ChatGPT',
  'gemini': 'Gemini',
  'claude': 'Claude',
  'grok': 'Grok',
};

const Chat = ({ 
  selectedModel, 
  apiKeys, 
  chatId, 
  onChatIdChange,
  onToggleSidebar 
}: ChatProps) => {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const emptyStateRef = useEmptyStateAnimation();
  const { containerRef, scrollToBottom } = useScrollToBottom([messages]);
  
  // Query to get chat history if a chatId is provided
  const { data: chatHistory, isLoading: isLoadingHistory, refetch: refetchHistory } = useQuery({
    queryKey: ['chatHistory', chatId],
    queryFn: async () => {
      if (!chatId) return Promise.resolve([]);
      try {
        console.log("Fetching chat history for:", chatId);
        const history = await getChatHistory(chatId);
        console.log("Got history:", history);
        return history;
      } catch (error) {
        console.error("Failed to fetch chat history:", error);
        toast({
          title: "Error loading chat history",
          description: "Could not load your previous messages",
          variant: "destructive",
        });
        return [];
      }
    },
    enabled: !!chatId,
    staleTime: 5000, // 5 seconds - reduced to help with testing
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  // Convert chat history to messages format
  React.useEffect(() => {
    console.log("Chat history state changed:", chatHistory);
    if (chatHistory && chatHistory.length > 0) {
      console.log("Processing chat history:", chatHistory.length, "messages");
      const formattedMessages = chatHistory
        .filter(msg => msg.role !== 'system') // Exclude system messages
        .map(msg => ({
          id: nanoid(),
          role: msg.role as MessageRole,
          content: msg.content,
          timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
        }));
      console.log("Formatted messages:", formattedMessages.length);
      setMessages(formattedMessages);
      setTimeout(() => scrollToBottom(), 100);
    } else if (!chatId) {
      // Clear messages when starting a new chat
      console.log("No chat ID, clearing messages");
      setMessages([]);
    }
  }, [chatHistory, chatId, scrollToBottom]);

  // Effect to scroll to bottom when messages change
  React.useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Get display name for the current model
  const getCurrentModelName = () => {
    return modelNames[selectedModel] || selectedModel;
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Create the user message
    const userMessage: Message = {
      id: nanoid(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    // Add the user message to the conversation
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    
    // Scroll to bottom after adding user message
    scrollToBottom();

    try {
      console.log("Sending message to backend:", {
        model: selectedModel,
        message: content,
        conversation_id: chatId
      });
      
      // Send message to backend
      const response = await sendChatMessage({
        model: selectedModel,
        message: content,
        conversation_id: chatId
      });
      
      console.log("Got response:", response);
      
      // Update chatId if this is a new conversation
      if (response.conversation_id && (!chatId || chatId !== response.conversation_id)) {
        console.log("Setting new chat ID:", response.conversation_id);
        onChatIdChange(response.conversation_id);
        
        // Invalidate chats query to refresh the sidebar with new conversation
        queryClient.invalidateQueries({ queryKey: ['chats'] });
      }
      
      // Create assistant message from response
      const assistantMessage: Message = {
        id: nanoid(),
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      
      // Invalidate the chat history query to ensure it's updated
      queryClient.invalidateQueries({ queryKey: ['chatHistory', response.conversation_id] });
      
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => scrollToBottom(), 100);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <header className="border-b border-border p-4 flex items-center justify-between shrink-0 z-10">
        <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="lg:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        <h1 className="text-xl font-bold">
          <span className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            {getCurrentModelName()}
          </span>
        </h1>
        <div className="flex items-center space-x-2">
          <ThemeSelector />
        </div>
      </header>

      <div 
        className="flex-1 overflow-y-auto scrollbar-custom relative" 
        ref={containerRef}
      >
        {isLoadingHistory ? (
          <div className="h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : messages.length === 0 ? (
          <div ref={emptyStateRef} className="h-full flex flex-col items-center justify-center opacity-0 transform scale-95">
            <MessageSquare className="h-12 w-12 mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Start a conversation</h2>
            <p className="text-muted-foreground max-w-sm text-center px-4">
              Send a message to start chatting with {getCurrentModelName()}.
            </p>
          </div>
        ) : (
          <div className="pb-24">
            {messages.map((message) => (
              <ChatMessage 
                key={message.id} 
                message={message} 
                modelName={getCurrentModelName()}
              />
            ))}
            {isLoading && (
              <div className="py-6 px-4 md:px-6 lg:px-8 flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="h-8 w-8 rounded-full border flex items-center justify-center bg-primary">
                    <div className="loading-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="animate-pulse space-y-2">
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="w-full border-t border-border bg-background fixed bottom-0 left-0 right-0">
        <div className="max-w-3xl mx-auto px-4 py-2">
          <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default Chat;
