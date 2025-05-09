
// Re-export the toast hook from the hooks directory
import { useToast as useToastHook, toast } from "@/hooks/use-toast";

// Export with the same name to maintain compatibility
export const useToast = useToastHook;
export { toast };
