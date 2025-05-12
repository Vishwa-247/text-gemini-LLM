
import * as React from 'react';
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

interface SidebarFooterProps {
  onOpenSettings: () => void;
}

const SidebarFooter: React.FC<SidebarFooterProps> = ({ onOpenSettings }) => {
  return (
    <div className="mt-auto p-4 border-t border-sidebar-border bg-sidebar">
      <Button 
        variant="ghost" 
        className="w-full justify-start gap-2"
        onClick={onOpenSettings}
      >
        <Settings className="w-4 h-4" />
        Settings
      </Button>
    </div>
  );
};

export default SidebarFooter;
