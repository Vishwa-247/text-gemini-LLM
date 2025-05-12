
# AI Chat Application

This application provides a ChatGPT-like interface for communicating with various AI models including ChatGPT, Gemini, and Claude.

## Features

- **Multi-model Support**: Choose between ChatGPT, Gemini, Claude, or add your own custom models
- **Chat History**: Automatically saves conversations in MongoDB and displays them in the sidebar for easy access
- **Persistent Conversations**: Continue previous conversations where you left off with full context preservation
- **Responsive Design**: Works on mobile and desktop devices
- **Theme Toggle**: Switch between light and dark mode
- **Settings Panel**: Configure API keys for different models
- **Custom Models**: Add your own AI models with custom endpoints

## Recent Fixes & Improvements

1. **Fixed Sidebar Visibility**: Completely fixed sidebar content display issues by improving CSS z-index values and component hierarchy
2. **Enhanced Chat History Persistence**: All conversations are now properly saved to MongoDB and can be accessed later
3. **Context Preservation**: Chat history maintains full conversation context across sessions
4. **Improved Loading States**: Added better loading indicators while fetching chat history
5. **Optimized MongoDB Integration**: Properly handling ObjectId conversion and data serialization
6. **Refactored Components**: Split large components into smaller, more maintainable pieces
   - Created separate components for ModelSelector, ChatHistoryList, NewChatButton, and SidebarFooter
   - Added SidebarContext for better state management of custom models
7. **Improved Styling**: Enhanced the UI with better contrast and spacing
8. **Optimized Performance**: Reduced unnecessary re-renders and API calls
9. **Fixed Scrolling Issues**: Chat now properly scrolls to bottom when new messages are added

## How to Use

1. Select an AI model from the sidebar
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
