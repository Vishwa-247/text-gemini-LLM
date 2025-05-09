
import React, { useState, useEffect, useRef } from 'react';
import { nanoid } from 'nanoid';
import ChatMessage, { Message, MessageRole } from './ChatMessage';
import ChatInput from './ChatInput';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { MessageSquare, Menu } from "lucide-react";
import { sendChatMessage } from "@/services/api";
import ThemeSelector from './ThemeSelector';

interface ChatProps {
  selectedModel: 'chatgpt' | 'gemini' | 'claude';
  apiKeys: {
    openai: string;
    gemini: string;
    anthropic: string;
  };
  onToggleSidebar: () => void;
}

const modelNames = {
  chatgpt: 'ChatGPT',
  gemini: 'Gemini',
  claude: 'Claude',
};

const Chat = ({ selectedModel, apiKeys, onToggleSidebar }: ChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Reset chat when model changes
  useEffect(() => {
    setMessages([]);
    setConversationId(undefined);
  }, [selectedModel]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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

    try {
      // Send message to backend
      const response = await sendChatMessage({
        model: selectedModel,
        message: content,
        conversation_id: conversationId
      });
      
      // Save conversation ID for future messages
      if (response.conversation_id) {
        setConversationId(response.conversation_id);
      }
      
      // Create assistant message from response
      const assistantMessage: Message = {
        id: nanoid(),
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
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
    <div className="flex flex-col h-screen">
      <header className="border-b border-border p-4 flex items-center justify-between">
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

      <div className="flex-1 overflow-y-auto scrollbar-custom">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground" />
              <h2 className="text-xl font-semibold">Start a conversation</h2>
              <p className="text-muted-foreground max-w-sm">
                Send a message to start chatting with {modelNames[selectedModel]}.
              </p>
            </div>
          </div>
        ) : (
          <div className="pt-4">
            {messages.map((message) => (
              <ChatMessage 
                key={message.id} 
                message={message} 
                modelName={modelNames[selectedModel]}
              />
            ))}
            {isLoading && (
              <div className="py-6 px-4 md:px-6 lg:px-8 flex items-center gap-4 animate-pulse">
                <div className="h-8 w-8 rounded-full bg-muted"></div>
                <div className="h-4 w-20 bg-muted rounded"></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
    </div>
  );
};

export default Chat;
