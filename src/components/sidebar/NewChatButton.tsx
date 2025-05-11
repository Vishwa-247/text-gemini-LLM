
import * as React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface NewChatButtonProps {
  onClick: () => void;
}

const NewChatButton: React.FC<NewChatButtonProps> = ({ onClick }) => {
  return (
    <div className="p-4">
      <Button 
        variant="outline" 
        className="w-full justify-start gap-2 bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/80 sidebar-item-appear"
        onClick={onClick}
      >
        <Plus className="w-4 h-4" />
        New chat
      </Button>
    </div>
  );
};

export default NewChatButton;
