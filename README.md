
# AI Chat Application

This application provides a ChatGPT-like interface for communicating with various AI models including ChatGPT, Gemini, Claude, and Grok.

## Features

- **Multi-model Support**: Choose between ChatGPT, Gemini, Claude, Grok, or add your own custom models
- **Automatic Chat Creation**: Clicking a model in the sidebar automatically starts a new chat
- **Chat History**: Automatically saves conversations in MongoDB and displays them in the sidebar for easy access
- **Persistent Conversations**: Continue previous conversations where you left off with full context preservation
- **Responsive Design**: Works on mobile and desktop devices
- **Theme Toggle**: Switch between light and dark mode
- **Settings Panel**: Configure API keys for different models
- **Custom Models**: Add your own AI models with custom endpoints

## Running the Application

### Frontend (React)

1. Install dependencies:
   ```
   npm install
   ```
   
2. Start the development server:
   ```
   npm run dev
   ```

### Backend (Flask)

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create and activate a virtual environment (optional but recommended):
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install Python dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Start the Flask server:
   ```
   python app.py
   ```

### MongoDB Setup

1. Install MongoDB if not already installed:
   - [MongoDB Community Server](https://www.mongodb.com/try/download/community)

2. Start MongoDB service:
   - On macOS/Linux: `sudo systemctl start mongod`
   - On Windows: It should run as a service after installation

3. The application will automatically create the necessary database and collections.

## Recent Fixes & Improvements

1. **Added Grok API Support**: Integrated Grok as a new AI model option
2. **Automatic Chat Creation**: Selecting a model in the sidebar now automatically creates a new chat
3. **Updated API Keys**: Pre-configured API keys for all supported models
4. **Fixed Sidebar Visibility**: Completely fixed sidebar content display issues
5. **Enhanced Chat History Persistence**: All conversations are now properly saved to MongoDB
6. **Context Preservation**: Chat history maintains full conversation context across sessions
7. **Improved Loading States**: Added better loading indicators while fetching chat history
8. **Optimized MongoDB Integration**: Properly handling ObjectId conversion and data serialization
9. **Refactored Components**: Split large components into smaller, more maintainable pieces

## How to Use

1. Select an AI model from the sidebar (this will start a new chat)
2. Type your message in the input box and press Enter or click the Send button
3. Your conversation will be saved automatically to MongoDB
4. Access previous conversations from the Chat History section in the sidebar
5. Add custom models via the + button in the Models section
6. Configure API keys in the Settings panel

## Technical Implementation

The application is built with:
- React for UI components
- TanStack Query for data fetching and caching
- MongoDB for storing chat history
- Flask backend with AI model integrations
- Tailwind CSS for styling
- Shadcn UI for component library
- GSAP for animations

Performance optimizations include:
- Stale-while-revalidate caching strategy
- Reduced re-renders with React.memo and useCallback
- Optimized loading states
- Component code splitting
