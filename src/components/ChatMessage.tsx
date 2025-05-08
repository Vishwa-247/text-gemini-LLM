
import { cn } from "@/lib/utils";
import { User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
  // We'll use the first letter of the model name for the avatar
  const firstLetter = modelName.charAt(0).toUpperCase();
  
  return (
    <Avatar className="h-8 w-8 border">
      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
        {firstLetter}
      </AvatarFallback>
    </Avatar>
  );
};

const ChatMessage = ({ message, modelName }: ChatMessageProps) => {
  const isUser = message.role === 'user';
  
  return (
    <div 
      className={cn(
        "py-6 px-4 md:px-6 lg:px-8 flex items-start gap-4 message-appear",
        isUser ? "bg-chat-user" : "bg-chat-assistant"
      )}
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
      
      <div className="flex-1 prose prose-slate dark:prose-invert max-w-none">
        <div className={cn("assistant-message", isUser && "user-message")}>
          <p>{message.content}</p>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
