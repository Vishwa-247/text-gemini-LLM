
import axios from 'axios';

// API base URL - change this to your Flask server's address
const API_BASE_URL = 'http://localhost:5000/api';

// API client instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export type ModelType = 'chatgpt' | 'gemini' | 'claude' | 'grok' | string;

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}

export interface CustomModel {
  id: string;
  name: string;
  apiEndpoint: string;
  apiKey: string;
}

interface ChatRequest {
  model: ModelType;
  message: string;
  conversation_id?: string;
  custom_model?: CustomModel;
}

interface ChatResponse {
  response: string;
  conversation_id: string;
  error?: string;
}

interface Chat {
  _id: string;
  user_id: string;
  title: string;
  model: ModelType;
  created_at: string;
  updated_at: string;
}

interface ChatsResponse {
  chats: Chat[];
  error?: string;
}

interface ChatHistoryResponse {
  messages: ChatMessage[];
  error?: string;
}

interface CustomModelRequest {
  id: string;
  name: string;
  apiEndpoint: string;
}

interface CustomModelResponse {
  success: boolean;
  message: string;
  error?: string;
}

// Send a chat message to the backend
export const sendChatMessage = async (request: ChatRequest): Promise<ChatResponse> => {
  try {
    // Check if this is a custom model
    if (!['chatgpt', 'gemini', 'claude', 'grok'].includes(request.model)) {
      // Load custom models from localStorage
      const customModelsStr = localStorage.getItem('custom-models');
      if (customModelsStr) {
        const customModels: CustomModel[] = JSON.parse(customModelsStr);
        const customModel = customModels.find(m => m.id === request.model);
        
        if (customModel) {
          // Add the custom model details to the request
          request.custom_model = customModel;
        }
      }
    }
    
    const response = await apiClient.post<ChatResponse>('/chat', request);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error('Failed to connect to the server');
  }
};

// Get all chats for the current user
export const getChats = async (): Promise<Chat[]> => {
  try {
    const response = await apiClient.get<ChatsResponse>('/chats');
    return response.data.chats || [];
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error('Failed to fetch chats');
  }
};

// Get chat history for a specific conversation
export const getChatHistory = async (chatId: string, limit = 50): Promise<ChatMessage[]> => {
  try {
    const response = await apiClient.get<ChatHistoryResponse>(`/chats/${chatId}?limit=${limit}`);
    return response.data.messages || [];
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error('Failed to fetch chat history');
  }
};

// Delete a chat
export const deleteChat = async (chatId: string): Promise<boolean> => {
  try {
    const response = await apiClient.delete(`/chats/${chatId}`);
    return response.data.success;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error('Failed to delete chat');
  }
};

// Save a custom model configuration
export const saveCustomModel = async (model: CustomModelRequest): Promise<boolean> => {
  try {
    const response = await apiClient.post<CustomModelResponse>('/models/custom', model);
    return response.data.success;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error('Failed to save custom model');
  }
};
