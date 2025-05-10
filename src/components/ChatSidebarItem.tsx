
import React from 'react';
import { cn } from '@/lib/utils';
import { MessageSquare, Trash2 } from 'lucide-react';
import { ModelType } from '@/services/api';
import { Button } from '@/components/ui/button';

interface ChatSidebarItemProps {
  id: string;
  title: string;
  model: ModelType;
  isActive: boolean;
  onClick: () => void;
  onDelete: () => void;
}

const modelIcons = {
  chatgpt: '🤖',
  gemini: '🔮',
  claude: '🧠',
};

const ChatSidebarItem: React.FC<ChatSidebarItemProps> = ({
  id,
  title,
  model,
  isActive,
  onClick,
  onDelete
}) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-colors",
        isActive 
          ? "bg-sidebar-primary text-sidebar-primary-foreground" 
          : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      )}
    >
      <div className="flex items-center gap-2 truncate">
        <span className="text-lg">{modelIcons[model] || '💬'}</span>
        <span className="truncate">{title}</span>
      </div>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-6 w-6 opacity-50 hover:opacity-100"
        onClick={handleDelete}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ChatSidebarItem;
