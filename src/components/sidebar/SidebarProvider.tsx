
import * as React from 'react';
import { ModelType } from '@/services/api';

export interface ChatSession {
  _id: string;
  title: string;
  model: ModelType;
}

export interface CustomModel {
  name: string;
  id: string;
  apiEndpoint: string;
  apiKey: string;
}

interface SidebarContextType {
  customModels: CustomModel[];
  setCustomModels: React.Dispatch<React.SetStateAction<CustomModel[]>>;
  isAddModelOpen: boolean;
  setIsAddModelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  saveCustomModel: (model: CustomModel) => void;
}

export const SidebarContext = React.createContext<SidebarContextType | undefined>(undefined);

interface SidebarProviderProps {
  children: React.ReactNode;
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({ children }) => {
  const [customModels, setCustomModels] = React.useState<CustomModel[]>([]);
  const [isAddModelOpen, setIsAddModelOpen] = React.useState(false);
  
  // Load custom models from localStorage
  React.useEffect(() => {
    const savedModels = localStorage.getItem('custom-models');
    if (savedModels) {
      try {
        setCustomModels(JSON.parse(savedModels));
      } catch (e) {
        console.error('Failed to load custom models:', e);
      }
    }
  }, []);

  // Save custom models to localStorage
  const saveCustomModel = (model: CustomModel) => {
    const updatedModels = [...customModels, model];
    setCustomModels(updatedModels);
    localStorage.setItem('custom-models', JSON.stringify(updatedModels));
  };
  
  return (
    <SidebarContext.Provider value={{ 
      customModels, 
      setCustomModels,
      isAddModelOpen,
      setIsAddModelOpen,
      saveCustomModel
    }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = React.useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};
