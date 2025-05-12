
import * as React from 'react';
import { Button } from "@/components/ui/button";
import { Settings, Info } from "lucide-react";

interface SidebarFooterProps {
  onOpenSettings: () => void;
}

const SidebarFooter: React.FC<SidebarFooterProps> = ({ onOpenSettings }) => {
  return (
    <div className="mt-auto p-4 border-t border-sidebar-border bg-sidebar">
      <Button 
        variant="ghost" 
        className="w-full justify-start gap-2 mb-2"
        onClick={onOpenSettings}
      >
        <Settings className="w-4 h-4" />
        Settings
      </Button>
      <div className="text-xs text-muted-foreground px-2 py-1">
        <div className="flex items-center gap-1">
          <Info className="w-3 h-3" />
          <span>Connected to MongoDB</span>
        </div>
        <div className="mt-1">
          All chats are saved automatically
        </div>
      </div>
    </div>
  );
};

export default SidebarFooter;
