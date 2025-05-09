
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

// API keys hardcoded for development purposes only
const OPENAI_API_KEY = "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";
const GEMINI_API_KEY = "AIzaSyD7H1yePFJWYW3zdtk7LktQz7WpBfU9LLc";

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

  const sendMessageToOpenAI = async (userMessage: string) => {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            ...messages.map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            { role: 'user', content: userMessage }
          ],
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to get response from OpenAI');
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error: any) {
      console.error('Error calling OpenAI API:', error);
      throw new Error(`Failed to get response: ${error.message}`);
    }
  };

  const sendMessageToGemini = async (userMessage: string) => {
    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: userMessage
                }
              ],
              role: "user"
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to get response from Gemini');
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error: any) {
      console.error('Error calling Gemini API:', error);
      throw new Error(`Failed to get response: ${error.message}`);
    }
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
      let responseText;
      
      if (selectedModel === 'chatgpt') {
        // Call OpenAI API
        responseText = await sendMessageToOpenAI(content);
      } else if (selectedModel === 'gemini') {
        // Call Gemini API
        responseText = await sendMessageToGemini(content);
      } else {
        // For Claude model, check if API key exists
        if (!apiKeys.anthropic) {
          toast({
            title: "API Key Required",
            description: `Please set your ${modelNames[selectedModel]} API key in settings.`,
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        } else {
          // Simulate response for Claude (will be implemented later)
          responseText = `This is a simulated response from ${modelNames[selectedModel]}. The integration with this model is not yet implemented.`;
        }
      }
      
      const assistantMessage: Message = {
        id: nanoid(),
        role: 'assistant',
        content: responseText,
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
