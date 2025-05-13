
import * as React from 'react';
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import ThemeSelector from './ThemeSelector';

interface ChatHeaderProps {
  onOpenSettings: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ onOpenSettings }) => {
  return (
    <header className="border-b border-border px-4 py-2 flex justify-between items-center bg-background/95 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex-1">
        <h1 className="text-lg font-semibold">AI Chat Assistant</h1>
      </div>
      <div className="flex items-center gap-2">
        <ThemeSelector />
        <Button 
          variant="ghost" 
          size="icon"
          className="h-8 w-8"
          onClick={onOpenSettings}
          title="Settings"
        >
          <Settings className="h-4 w-4" />
          <span className="sr-only">Settings</span>
        </Button>
      </div>
    </header>
  );
};

export default ChatHeader;
