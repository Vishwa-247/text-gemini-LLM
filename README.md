
# AI Chat Application

This application provides a ChatGPT-like interface for communicating with various AI models including ChatGPT, Gemini, and Claude.

## Features

- **Multi-model Support**: Choose between ChatGPT, Gemini, Claude, or add your own custom models
- **Chat History**: Automatically saves conversations in the sidebar for easy access
- **Responsive Design**: Works on mobile and desktop devices
- **Theme Toggle**: Switch between light and dark mode
- **Settings Panel**: Configure API keys for different models
- **Custom Models**: Add your own AI models with custom endpoints

## Recent Fixes & Improvements

1. **Fixed Sidebar Visibility**: The sidebar now properly displays on all screen sizes and devices
2. **Enhanced Chat History**: Conversations are now properly saved and displayed in the sidebar
3. **Removed Unnecessary Loading States**: Optimized loading behavior to prevent excessive loading states
4. **Refactored Components**: Split large components into smaller, more manageable pieces for better maintainability
   - Created separate components for ModelSelector, ChatHistoryList, NewChatButton, and SidebarFooter
   - Added SidebarContext for better state management of custom models
5. **Improved Styling**: Enhanced the UI with better contrast and spacing
6. **Optimized Performance**: Reduced unnecessary re-renders and API calls
7. **Fixed Scrolling Issues**: Chat now properly scrolls to bottom when new messages are added

## How to Use

1. Select an AI model from the sidebar
2. Type your message in the input box and press Enter or click the Send button
3. Your conversation will be saved automatically
4. Access previous conversations from the Chat History section in the sidebar
5. Add custom models via the + button in the Models section
6. Configure API keys in the Settings panel

## Technical Implementation

The application is built with:
- React for UI components
- TanStack Query for data fetching and caching
- Tailwind CSS for styling
- Shadcn UI for component library
- GSAP for animations

Performance optimizations include:
- Stale-while-revalidate caching strategy
- Reduced re-renders with React.memo and useCallback
- Optimized loading states
- Component code splitting
