
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ModelType } from '@/services/api';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface ChatSidebarItemProps {
  id: string;
  title: string;
  model: ModelType;
  isActive?: boolean;
  onClick: () => void;
  onDelete: () => void;
  animationDelay?: number;
}

const modelIcons: Record<ModelType, string> = {
  chatgpt: '🤖',
  gemini: '🔮',
  claude: '🧠',
};

const ChatSidebarItem = ({ 
  id, 
  title, 
  model, 
  isActive = false,
  onClick,
  onDelete,
  animationDelay = 0
}: ChatSidebarItemProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (itemRef.current) {
      // Set initial state for GSAP animation
      gsap.set(itemRef.current, {
        opacity: 0,
        x: -10
      });
      
      // Animate the sidebar item
      gsap.to(itemRef.current, {
        opacity: 1,
        x: 0,
        duration: 0.3,
        ease: "power2.out",
        delay: animationDelay
      });
    }
  }, [animationDelay]);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };

  // Trim the title if it's too long
  const displayTitle = title.length > 25
    ? title.substring(0, 25) + '...'
    : title;

  return (
    <div
      ref={itemRef}
      className={`relative flex items-center ${isActive ? 'bg-sidebar-accent rounded-md' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Button
        variant="ghost"
        className="w-full justify-start gap-2 text-sm overflow-hidden"
        onClick={onClick}
      >
        <span className="text-lg flex-shrink-0">{modelIcons[model] || '💬'}</span>
        <span className="truncate">{displayTitle}</span>
      </Button>
      
      {(isHovered || isActive) && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete chat</span>
        </Button>
      )}
    </div>
  );
};

export default ChatSidebarItem;
