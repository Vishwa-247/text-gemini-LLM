
import * as React from 'react';
import { Separator } from "@/components/ui/separator";
import pkg from '../../../package.json';

const SidebarFooter = () => {
  const year = new Date().getFullYear();
  const version = pkg.version || '1.0.0';
  
  return (
    <div className="mt-auto p-4 text-xs text-muted-foreground">
      <Separator className="mb-4" />
      <p className="text-center">
        © {year} AI Chat Assistant v{version}
      </p>
    </div>
  );
};

export default SidebarFooter;
