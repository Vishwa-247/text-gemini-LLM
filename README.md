
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
- **Improved Text Visibility**: Enhanced contrast and spacing for better readability

## Security

API keys are stored in `.env` files which should be added to `.gitignore`. The keys in the repository are for demonstration purposes only. In production, you should:

1. Add both `.env` and `backend/.env` to your `.gitignore` file
2. Never commit real API keys to your repository
3. Use environment variables in production environments

## Running the Application

### Frontend (React)

1. Create a `.env` file in the root directory with your API keys:
   ```
   VITE_OPENAI_API_KEY=your_openai_key
   VITE_GEMINI_API_KEY=your_gemini_key
   VITE_ANTHROPIC_API_KEY=your_claude_key
   VITE_GROK_API_KEY=your_grok_key
   ```

2. Install dependencies:
   ```
   npm install
   ```
   
3. Start the development server:
   ```
   npm run dev
   ```

### Backend (Flask)

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create a `.env` file with your API keys:
   ```
   OPENAI_API_KEY=your_openai_key
   GEMINI_API_KEY=your_gemini_key
   ANTHROPIC_API_KEY=your_claude_key
   GROK_API_KEY=your_grok_key
   MONGO_URI=mongodb://localhost:27017/
   DB_NAME=studymate_db
   ```

3. Create and activate a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

4. Install Python dependencies:
   ```
   pip install -r requirements.txt
   ```

5. Start the Flask server:
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

## Recent Improvements

1. **Enhanced Text Visibility**: Improved contrast and spacing for better text readability
2. **Fixed Chat Display**: Messages now render properly with correct styling
3. **UI Cleanup**: Removed redundant theme selector and simplified settings access
4. **API Key Security**: Moved all API keys to .env files for better security
5. **Fixed New Chat Functionality**: Selecting a new model now properly starts a new chat
6. **Code Refactoring**: Split components into smaller, more maintainable files
7. **Simplified Footer**: Removed unnecessary text in the sidebar footer
8. **Improved Loading States**: Enhanced the appearance of loading indicators
9. **Better Chat History Filtering**: System messages no longer appear in the chat UI
10. **Enhanced Scrolling**: Automatic scrolling to latest messages now works reliably

## How to Contribute

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request
