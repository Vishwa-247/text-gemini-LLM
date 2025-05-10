
# Studymate AI Chat Application

This project is a full-stack AI chat application that uses OpenAI, Gemini, and Claude APIs to provide career coaching assistance. It saves conversation history in MongoDB and allows users to switch between different AI models.

## Project Structure

```
studymate-chat/
├── backend/
│   ├── app.py                 # Flask entry point
│   ├── routers/
│   │   └── chat.py            # Chat API endpoints
│   ├── services/
│   │   ├── openai_service.py  # OpenAI integration
│   │   ├── gemini_service.py  # Google Gemini integration
│   │   └── claude_service.py  # Anthropic Claude integration
│   ├── models/
│   │   └── chat_history.py    # Data models
│   ├── database/
│   │   └── mongodb.py         # MongoDB connection and operations
│   └── requirements.txt       # Backend dependencies
└── src/                       # Frontend React application
    └── components/            # React components
```

## Setup Instructions

### Backend Setup

1. Install MongoDB
   ```bash
   # For macOS with homebrew
   brew tap mongodb/brew
   brew install mongodb-community

   # For Windows, download from MongoDB website
   # Then run MongoDB as a service
   ```

2. Install Python dependencies
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. Start the Flask server
   ```bash
   cd backend
   python app.py
   ```

### Frontend Setup

1. Install Node.js dependencies
   ```bash
   npm install
   ```

2. Start the development server
   ```bash
   npm run dev
   ```

3. Access the application at http://localhost:5173

## Features

- Chat with multiple AI models (GPT-4, Gemini, Claude)
- Save and retrieve chat history
- Switch between AI models
- Create new conversations
- Delete old conversations

## Environment Variables

The backend uses these environment variables (or hardcoded defaults):

- `OPENAI_API_KEY`: Your OpenAI API key
- `GEMINI_API_KEY`: Your Google Gemini API key 
- `ANTHROPIC_API_KEY`: Your Anthropic Claude API key
- `MONGO_URI`: MongoDB connection string (defaults to "mongodb://localhost:27017/")

## MongoDB Structure

The application uses two collections:
1. `chat_boxes`: Stores chat metadata (title, model, timestamps)
2. `chat_messages`: Stores individual messages linked to chats
