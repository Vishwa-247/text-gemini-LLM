
import React, { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import ChatMessage, { Message, MessageRole } from './ChatMessage';
import ChatInput from './ChatInput';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { MessageSquare, Menu, Loader2 } from "lucide-react";
import { sendChatMessage, getChatHistory, ModelType } from "@/services/api";
import ThemeSelector from './ThemeSelector';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMessageAnimation, useEmptyStateAnimation, useScrollToBottom } from '@/hooks/use-gsap-animations';

interface ChatProps {
  selectedModel: ModelType;
  apiKeys: {
    openai: string;
    gemini: string;
    anthropic: string;
  };
  chatId?: string;
  onChatIdChange: (chatId: string) => void;
  onToggleSidebar: () => void;
}

const modelNames = {
  chatgpt: 'MyGpt',
  gemini: 'Gemini',
  claude: 'Claude',
};

const Chat = ({ 
  selectedModel, 
  apiKeys, 
  chatId, 
  onChatIdChange,
  onToggleSidebar 
}: ChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const emptyStateRef = useEmptyStateAnimation();
  const { containerRef, scrollToBottom } = useScrollToBottom([messages]);
  
  // Use GSAP animation for messages
  useMessageAnimation('.message-appear', 0.1);

  // Query to get chat history if a chatId is provided
  const { data: chatHistory, isLoading: isLoadingHistory } = useQuery({
    queryKey: ['chatHistory', chatId],
    queryFn: () => {
      if (!chatId) return Promise.resolve([]);
      return getChatHistory(chatId);
    },
    enabled: !!chatId,
  });

  // Convert chat history to messages format
  useEffect(() => {
    if (chatHistory && chatHistory.length > 0) {
      const formattedMessages = chatHistory.map(msg => ({
        id: nanoid(),
        role: msg.role as MessageRole,
        content: msg.content,
        timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
      }));
      setMessages(formattedMessages);
    } else if (!chatId) {
      // Clear messages when starting a new chat
      setMessages([]);
    }
  }, [chatHistory, chatId]);

  // Effect to scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

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
      // Send message to backend
      const response = await sendChatMessage({
        model: selectedModel,
        message: content,
        conversation_id: chatId
      });
      
      // Update chatId if this is a new conversation
      if (response.conversation_id && (!chatId || chatId !== response.conversation_id)) {
        onChatIdChange(response.conversation_id);
        
        // Invalidate chats query to refresh the sidebar
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
      // Scroll will be triggered by the useEffect
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
            {modelNames[selectedModel]}
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
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : messages.length === 0 ? (
          <div ref={emptyStateRef} className="h-full flex flex-col items-center justify-center opacity-0 transform scale-95">
            <MessageSquare className="h-12 w-12 mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Start a conversation</h2>
            <p className="text-muted-foreground max-w-sm text-center">
              Send a message to start chatting with {modelNames[selectedModel]}.
            </p>
          </div>
        ) : (
          <div className="pt-4 pb-36">
            {messages.map((message) => (
              <ChatMessage 
                key={message.id} 
                message={message} 
                modelName={modelNames[selectedModel]}
              />
            ))}
            {isLoading && (
              <div className="py-6 px-4 md:px-6 lg:px-8 flex items-start gap-4 animate-pulse">
                <div className="flex-shrink-0 mt-1">
                  <div className="h-8 w-8 rounded-full bg-primary/30"></div>
                </div>
                <div className="flex flex-col gap-2 w-full max-w-2xl">
                  <div className="h-4 w-2/3 bg-muted rounded"></div>
                  <div className="h-4 w-1/2 bg-muted rounded"></div>
                  <div className="h-4 w-3/4 bg-muted rounded"></div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 pb-4 pt-6 px-2 sm:px-4 bg-gradient-to-t from-background via-background to-transparent">
        <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
      </div>
    </div>
  );
};

export default Chat;
