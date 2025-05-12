
import React, { createContext, useContext, useState, useEffect } from 'react';

interface CustomModel {
  name: string;
  id: string;
  apiEndpoint?: string;
  apiKey?: string;
}

interface SidebarContextType {
  customModels: CustomModel[];
  saveCustomModel: (model: CustomModel) => void;
  deleteCustomModel: (id: string) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [customModels, setCustomModels] = useState<CustomModel[]>([]);

  // Load custom models from localStorage
  useEffect(() => {
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

  // Delete custom model
  const deleteCustomModel = (id: string) => {
    const updatedModels = customModels.filter(model => model.id !== id);
    setCustomModels(updatedModels);
    localStorage.setItem('custom-models', JSON.stringify(updatedModels));
  };

  return (
    <SidebarContext.Provider value={{ customModels, saveCustomModel, deleteCustomModel }}>
      {children}
    </SidebarContext.Provider>
  );
}
