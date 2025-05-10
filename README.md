
# Studymate AI Chat Application

This is a chat application that integrates with multiple AI providers (OpenAI, Google Gemini, Anthropic Claude) and stores chat history in MongoDB.

## Project Structure

- `src/` - Frontend React application
- `server/` - Backend Flask API
- `server/llm_clients/` - AI service integrations
- `server/db/` - MongoDB integration

## Prerequisites

1. Node.js and npm (or yarn)
2. Python 3.7+ and pip
3. MongoDB installed locally or a MongoDB Atlas account

## Setup Instructions

### 1. Install MongoDB

**On Windows:**
1. Download MongoDB Community Server from the [official website](https://www.mongodb.com/try/download/community)
2. Follow the installation wizard
3. MongoDB should run as a service automatically

**On macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### 2. Set up Backend

1. Navigate to the server directory:
```bash
cd server
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Start the Flask server:
```bash
python app.py
```
The Flask server will run on http://localhost:5000

### 3. Set up Frontend

1. In another terminal, navigate to the project root
2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```
The frontend will run on http://localhost:5173

## MongoDB Management

You can use MongoDB Compass (a GUI tool) to visualize and manage your database:
1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect to your MongoDB instance (default: `mongodb://localhost:27017/`)
3. You should see the `studymate_db` database with `chat_boxes` and `chat_messages` collections

## API Endpoints

- `POST /api/chat` - Send a chat message
- `GET /api/chats` - Get all chats
- `GET /api/chats/:id` - Get messages for a specific chat
- `DELETE /api/chats/:id` - Delete a chat and its messages

## Environment Variables

For production, create a `.env` file in the server directory with:
```
MONGO_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_key
GEMINI_API_KEY=your_gemini_key
ANTHROPIC_API_KEY=your_claude_key
```
