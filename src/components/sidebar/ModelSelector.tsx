
import * as React from 'react';
import { Button } from "@/components/ui/button";
import { ModelType } from '@/services/api';
import { ScrollArea } from "@/components/ui/scroll-area";

interface ModelSelectorProps {
  selectedModel: ModelType;
  onSelectModel: (model: ModelType) => void;
  onNewChat: () => void;
}

const models = [
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
  onNewChat
}) => {
  // Handle model selection and start a new chat
  const handleModelSelect = (modelId: ModelType) => {
    onSelectModel(modelId);
    onNewChat(); // Start a new chat when model is selected
  };

  return (
    <div className="px-2 py-2">
      <h2 className="text-lg font-semibold mb-2 px-2">Models</h2>
      <ScrollArea className="h-[160px]">
        <div className="space-y-1 pr-2">
          {models.map((model) => (
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
      </ScrollArea>
    </div>
  );
};

export default ModelSelector;
