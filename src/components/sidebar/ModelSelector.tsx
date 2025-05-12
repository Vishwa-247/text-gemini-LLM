
import * as React from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { ModelType } from '@/services/api';

interface ModelSelectorProps {
  selectedModel: ModelType;
  onSelectModel: (model: ModelType) => void;
  onAddCustomModel: () => void;
  onNewChat: () => void; // Added this prop
  customModels: Array<{
    id: string;
    name: string;
    apiEndpoint?: string;
    apiKey?: string;
  }>;
}

const defaultModels = [
  {
    id: 'chatgpt' as ModelType,
    name: 'ChatGPT',
    icon: '🤖'
  },
  {
    id: 'gemini' as ModelType,
    name: 'Gemini',
    icon: '🔮'
  },
  {
    id: 'claude' as ModelType,
    name: 'Claude',
    icon: '🧠'
  },
  {
    id: 'grok' as ModelType,
    name: 'Grok',
    icon: '🧩'
  }
];

const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModel,
  onSelectModel,
  onAddCustomModel,
  onNewChat,
  customModels
}) => {
  // Combined models
  const allModels = [
    ...defaultModels,
    ...customModels.map(model => ({
      id: model.id as ModelType,
      name: model.name,
      icon: '⚙️'
    }))
  ];

  // Handle model selection and start a new chat
  const handleModelSelect = (modelId: ModelType) => {
    onSelectModel(modelId);
    onNewChat(); // Start a new chat when model is selected
  };

  return (
    <div className="px-2 py-2">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-lg font-semibold">Models</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0"
          onClick={onAddCustomModel}
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
            className="w-full justify-start gap-2"
            onClick={() => handleModelSelect(model.id)}
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
