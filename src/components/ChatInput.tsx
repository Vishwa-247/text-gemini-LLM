
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useSendButtonAnimation } from "@/hooks/use-gsap-animations";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const ChatInput = ({ onSendMessage, disabled = false }: ChatInputProps) => {
  const [message, setMessage] = React.useState("");
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const sendButtonRef = useSendButtonAnimation();

  React.useEffect(() => {
    // Auto-focus textarea when component mounts
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage("");
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, 100); // Reduced max height
      textareaRef.current.style.height = `${newHeight}px`;
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="w-full max-w-2xl mx-auto" // Decreased width from max-w-3xl to max-w-2xl
    >
      <div className="relative bg-background rounded-md border border-input">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          placeholder="Message..."
          className="resize-none pr-12 min-h-[40px] max-h-[100px] bg-transparent rounded-md w-full overflow-y-auto border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          disabled={disabled}
        />
        <Button
          ref={sendButtonRef}
          type="submit"
          size="icon"
          disabled={!message.trim() || disabled}
          className="absolute right-2 bottom-1"
        >
          <Send className="h-4 w-4" />
          <span className="sr-only">Send message</span>
        </Button>
      </div>
      <p className="text-xs text-muted-foreground text-center mt-1 mb-1">
        AI can make mistakes. Verify important information.
      </p>
    </form>
  );
};

export default ChatInput;
