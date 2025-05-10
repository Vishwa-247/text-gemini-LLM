
# Chat Application with AI Integration

A modern chat interface application that integrates with multiple AI services (ChatGPT, Gemini, Claude) and provides chat session persistence using MongoDB.

## Features

- Clean, responsive UI with smooth GSAP animations
- Support for multiple AI chat models
- Persistent chat history with MongoDB
- Ability to switch between different conversations
- Mobile-friendly design

## Setup Instructions

### 1. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Install the required Python packages
pip install -r requirements.txt

# Make sure MongoDB is running
# Start the Flask server
python app.py
```

### 2. Frontend Setup

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

### Environment Variables

Create a `.env` file in the backend directory with the following variables:

```
# API Keys
OPENAI_API_KEY=your_openai_api_key
GEMINI_API_KEY=your_gemini_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key

# MongoDB
MONGO_URI=mongodb://localhost:27017/
DB_NAME=studymate_db

# Model Names
OPENAI_MODEL=gpt-4o-mini
ANTHROPIC_MODEL=claude-3-sonnet-20240229
GEMINI_MODEL=gemini-1.5-pro
```

## Usage

1. Select your preferred AI model in the sidebar (ChatGPT, Gemini, or Claude)
2. Start a new conversation by clicking "New Chat"
3. Type your message in the input box at the bottom
4. View your chat history in the sidebar
5. Click on any previous chat to continue the conversation

## Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS, GSAP animations
- **Backend**: Flask, Python
- **Database**: MongoDB
- **AI Services**: OpenAI (ChatGPT), Google (Gemini), Anthropic (Claude)
