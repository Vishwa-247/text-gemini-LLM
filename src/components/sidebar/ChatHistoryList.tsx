
import * as React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatSidebarItem from '../ChatSidebarItem';
import { ModelType } from '@/services/api';

export interface ChatSession {
  _id: string;
  title: string;
  model: ModelType;
}

interface ChatHistoryListProps {
  chats: ChatSession[];
  currentChatId?: string;
  onSelectChat: (chatId: string, model: ModelType) => void;
  onDeleteChat: (chatId: string) => void;
  isLoading: boolean;
}

const ChatHistoryList: React.FC<ChatHistoryListProps> = ({
  chats,
  currentChatId,
  onSelectChat,
  onDeleteChat,
  isLoading
}) => {
  return (
    <div className="flex-1 overflow-hidden flex flex-col px-2 py-2">
      <h2 className="px-2 text-lg font-semibold mb-2">Chat History</h2>
      <ScrollArea className="flex-1">
        <div className="space-y-1 pb-4 pr-2">
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : chats.length === 0 ? (
            <div className="text-center text-muted-foreground p-4 bg-sidebar-accent/10 rounded-md">
              <p className="mb-1">No chat history</p>
              <p className="text-xs">Start a new chat to begin</p>
            </div>
          ) : (
            chats.map((chat, index) => (
              <ChatSidebarItem 
                key={chat._id}
                id={chat._id}
                title={chat.title}
                model={chat.model}
                isActive={currentChatId === chat._id}
                onClick={() => onSelectChat(chat._id, chat.model)}
                onDelete={() => onDeleteChat(chat._id)}
                animationDelay={index * 0.05}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatHistoryList;
