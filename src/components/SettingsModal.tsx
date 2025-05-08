
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  apiKeys: {
    openai: string;
    gemini: string;
    anthropic: string;
  };
  onSaveApiKeys: (keys: { openai: string; gemini: string; anthropic: string }) => void;
}

const SettingsModal = ({ 
  open, 
  onOpenChange, 
  apiKeys,
  onSaveApiKeys
}: SettingsProps) => {
  const [keys, setKeys] = useState(apiKeys);
  
  const handleSave = () => {
    onSaveApiKeys(keys);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure your API keys and preferences.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="openai-key">OpenAI API Key</Label>
            <Input
              id="openai-key"
              type="password"
              value={keys.openai}
              onChange={(e) => setKeys({ ...keys, openai: e.target.value })}
              placeholder="sk-..."
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="gemini-key">Google Gemini API Key</Label>
            <Input
              id="gemini-key"
              type="password"
              value={keys.gemini}
              onChange={(e) => setKeys({ ...keys, gemini: e.target.value })}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="anthropic-key">Anthropic API Key</Label>
            <Input
              id="anthropic-key"
              type="password"
              value={keys.anthropic}
              onChange={(e) => setKeys({ ...keys, anthropic: e.target.value })}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="theme">Theme</Label>
            <Select defaultValue="dark">
              <SelectTrigger id="theme">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="light" disabled>Light (Coming soon)</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
