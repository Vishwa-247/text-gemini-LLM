
import React, { useState, useEffect, useRef } from 'react';
import { nanoid } from 'nanoid';
import ChatMessage, { Message, MessageRole } from './ChatMessage';
import ChatInput from './ChatInput';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { MessageSquare, Menu } from "lucide-react";

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Reset chat when model changes
  useEffect(() => {
    setMessages([]);
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

    // Check if API key is available
    const apiKeyMap = {
      chatgpt: apiKeys.openai,
      gemini: apiKeys.gemini,
      claude: apiKeys.anthropic,
    };

    if (!apiKeyMap[selectedModel]) {
      toast({
        title: "API Key Required",
        description: `Please set your ${modelNames[selectedModel]} API key in settings.`,
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      // This is where you'd make the API call to your Flask backend
      // For now, just simulate a response
      setTimeout(() => {
        const assistantMessage: Message = {
          id: nanoid(),
          role: 'assistant',
          content: `This is a simulated response from ${modelNames[selectedModel]}. In the real implementation, this would be handled by the Flask backend connecting to the ${modelNames[selectedModel]} API.`,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 1000);

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again later.",
        variant: "destructive",
      });
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
        <div className="w-9" /> {/* This is to ensure the title stays centered */}
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
