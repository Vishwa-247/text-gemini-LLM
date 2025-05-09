
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

export type ModelType = 'chatgpt' | 'gemini' | 'claude';

interface ChatRequest {
  model: ModelType;
  message: string;
  conversation_id?: string;
}

interface ChatResponse {
  response: string;
  conversation_id: string;
  error?: string;
}

// Send a chat message to the backend
export const sendChatMessage = async (request: ChatRequest): Promise<ChatResponse> => {
  try {
    const response = await apiClient.post<ChatResponse>('/chat', request);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error('Failed to connect to the server');
  }
};
