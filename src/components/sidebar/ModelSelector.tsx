
import * as React from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { ModelType } from '@/services/api';

interface ModelSelectorProps {
  selectedModel: ModelType;
  onSelectModel: (model: ModelType) => void;
  onAddModel: () => void;
  customModels: {
    id: string;
    name: string;
    apiEndpoint?: string;
    apiKey?: string;
  }[];
}

// Default models available in the application
const defaultModels = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    icon: '🤖'
  },
  {
    id: 'gemini',
    name: 'Gemini',
    icon: '🔮'
  },
  {
    id: 'claude',
    name: 'Claude',
    icon: '🧠'
  }
];

const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModel,
  onSelectModel,
  onAddModel,
  customModels
}) => {
  // Combined models list (default + custom)
  const allModels = [
    ...defaultModels,
    ...customModels.map(model => ({
      id: model.id as ModelType,
      name: model.name,
      icon: '⚙️'
    }))
  ];

  return (
    <div className="px-2 py-2 sidebar-item-appear">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-lg font-semibold">Models</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0"
          onClick={onAddModel}
        >
          <PlusCircle className="h-4 w-4" />
          <span className="sr-only">Add custom model</span>
        </Button>
      </div>
      <div className="mt-2 space-y-1">
        {allModels.map((model) => (
          <Button
            key={model.id}
            variant={selectedModel === model.id ? "secondary" : "ghost"}
            className="w-full justify-start gap-2 sidebar-item-appear"
            onClick={() => onSelectModel(model.id)}
          >
            <span className="text-lg">{model.icon}</span>
            {model.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ModelSelector;
