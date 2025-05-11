
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Check, X } from "lucide-react";

interface CustomModel {
  name: string;
  id: string;
  apiEndpoint: string;
  apiKey: string;
}

interface CustomModelFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (model: CustomModel) => void;
}

const CustomModelForm = ({ open, onOpenChange, onSave }: CustomModelFormProps) => {
  const [modelName, setModelName] = useState("");
  const [modelId, setModelId] = useState("");
  const [apiEndpoint, setApiEndpoint] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!modelName || !modelId || !apiEndpoint || !apiKey) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    // Simulate validation
    setIsValidating(true);
    setTimeout(() => {
      onSave({
        name: modelName,
        id: modelId.toLowerCase().replace(/\s+/g, '-'),
        apiEndpoint,
        apiKey,
      });
      
      // Reset form
      setModelName("");
      setModelId("");
      setApiEndpoint("");
      setApiKey("");
      setIsValidating(false);
      
      // Close dialog
      onOpenChange(false);
      
      toast({
        title: "Model added",
        description: `${modelName} has been added to your models.`,
      });
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Custom Model</DialogTitle>
          <DialogDescription>
            Add your own AI model to use in conversations.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="modelName">Model Display Name</Label>
            <Input
              id="modelName"
              placeholder="e.g. Llama 3"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="modelId">Model ID (unique identifier)</Label>
            <Input
              id="modelId"
              placeholder="e.g. llama-3"
              value={modelId}
              onChange={(e) => setModelId(e.target.value)}
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="apiEndpoint">API Endpoint</Label>
            <Input
              id="apiEndpoint"
              placeholder="https://api.example.com/v1/chat"
              value={apiEndpoint}
              onChange={(e) => setApiEndpoint(e.target.value)}
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="Enter your API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              required
            />
          </div>
          
          <DialogFooter className="pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isValidating}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isValidating}>
              {isValidating ? (
                <span className="flex items-center gap-2">
                  Validating <span className="loading-dots inline-flex ml-1"><span></span><span></span><span></span></span>
                </span>
              ) : (
                "Add Model"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CustomModelForm;
