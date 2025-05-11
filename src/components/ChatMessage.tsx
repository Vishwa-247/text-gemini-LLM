
import { cn } from "@/lib/utils";
import { User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ReactMarkdown from 'react-markdown';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useTheme } from "@/contexts/ThemeContext";

export type MessageRole = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
  modelName: string;
}

const ModelAvatar = ({ modelName }: { modelName: string }) => {
  return (
    <Avatar className="h-8 w-8 border">
      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
        {modelName.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};

const ChatMessage = ({ message, modelName }: ChatMessageProps) => {
  const isUser = message.role === 'user';
  const messageRef = useRef<HTMLDivElement>(null);
  const { theme, colors } = useTheme();
  
  useEffect(() => {
    if (messageRef.current) {
      gsap.set(messageRef.current, {
        opacity: 0,
        y: 20
      });
      
      gsap.to(messageRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out",
        delay: 0.1
      });
    }
  }, []);
  
  return (
    <div 
      ref={messageRef}
      className={cn(
        "py-6 px-4 md:px-6 lg:px-8 flex items-start gap-4 message-appear",
        isUser ? "bg-chat-user" : "bg-chat-assistant"
      )}
      style={{ 
        backgroundColor: isUser ? colors.chat.user : colors.chat.assistant 
      }}
    >
      <div className="flex-shrink-0 mt-1">
        {isUser ? (
          <Avatar className="h-8 w-8 border">
            <AvatarFallback className="bg-muted/50">
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
        ) : (
          <ModelAvatar modelName={modelName} />
        )}
      </div>
      
      <div className="flex-1 prose prose-slate dark:prose-invert max-w-none overflow-hidden">
        <div className={cn("message", isUser ? "user-message" : "assistant-message")}>
          {isUser ? (
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          ) : (
            <ReactMarkdown className="whitespace-pre-wrap break-words">{message.content}</ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
