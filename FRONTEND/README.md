# ChatDesk - Frontend

Modern real-time desktop chat application built with React, Electron, and Redux Toolkit.

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or higher
- npm or yarn

### Installation

1. Install dependencies:
```bash
cd FRONTEND
npm install
```

2. Start development server:
```bash
npm run dev
```

This will start the Vite dev server at `http://localhost:5173`

### Running with Electron

1. Start the Electron app in development mode:
```bash
npm run electron:dev
```

This will:
- Start the Vite dev server
- Wait for it to be ready
- Launch the Electron app

### Building for Production

1. Build the React app:
```bash
npm run build
```

2. Build the Electron app:
```bash
npm run electron:build
```

The built app will be in the `dist-electron` directory.

## 📁 Project Structure

```
FRONTEND/
├── electron/              # Electron main process files
│   ├── main/
│   │   ├── index.js      # Main entry point
│   │   ├── tray-manager.js
│   │   └── notification-manager.js
│   ├── preload/
│   │   └── preload.js    # Secure preload script
│   └── resources/        # App icons and assets
├── src/
│   ├── components/       # React components
│   │   ├── auth/        # Authentication components
│   │   ├── chat/        # Chat components
│   │   ├── layout/      # Layout components
│   │   ├── common/      # Reusable components
│   │   ├── files/       # File upload components
│   │   ├── notifications/
│   │   ├── search/
│   │   ├── profile/
│   │   └── workspace/
│   ├── store/           # Redux store
│   │   ├── slices/      # Redux slices
│   │   └── middleware/  # Custom middleware
│   ├── services/        # API and WebSocket services
│   ├── utils/           # Utility functions
│   ├── styles/          # CSS files
│   ├── App.jsx          # Root component
│   └── main.jsx         # Entry point
├── public/              # Static assets
├── index.html           # HTML template
├── package.json
├── vite.config.js
├── tailwind.config.js
└── svelte.config.js
```

## 🎨 Features Implemented

### Authentication
- Login form
- Register form
- JWT token management
- Protected routes

### Chat System
- Real-time messaging
- Message list with timestamps
- Message input with emoji picker
- File attachment support
- Typing indicators
- Message reactions
- Reply to messages
- Edit/delete messages

### Layout
- Sidebar with workspace navigation
- Chat list panel with tabs (Chats, Groups, Channels)
- Header with chat info
- Responsive design

### State Management
- Redux Toolkit for global state
- Slices for auth, chat, user, notifications, workspace, UI
- WebSocket middleware for real-time updates

### UI Components
- Button, Input, Modal, Avatar, LoadingSpinner
- Dark/Light theme support
- TailwindCSS styling

### Electron Features
- Desktop notifications
- System tray support
- Window management
- Secure preload scripts

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_WS_BASE_URL=http://localhost:8000
VITE_GRAPHQL_ENDPOINT=http://localhost:8000/graphql
```

### Theme

The app supports dark and light themes. The default theme is dark.

## 📝 Available Scripts

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run electron` - Run Electron app
- `npm run electron:dev` - Run Electron in development mode
- `npm run electron:build` - Build Electron app for distribution

## 🛠️ Tech Stack

- **Frontend**: React 18.x
- **Desktop**: Electron 28.x
- **State Management**: Redux Toolkit
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **Real-time**: Socket.io Client
- **Build Tool**: Vite
- **Routing**: React Router DOM

## 🔌 Backend Integration

The frontend is designed to work with a FastAPI backend with:
- GraphQL API
- WebSocket support
- JWT authentication
- PostgreSQL database

See the `BACKEND/` directory for the backend implementation.

## 🐛 Troubleshooting

### Port already in use
If port 5173 is already in use, you can change it in `vite.config.js`:

```javascript
server: {
  port: 3000, // Change to your preferred port
}
```

### Electron not loading
Make sure the Vite dev server is running before starting Electron in development mode.

### WebSocket connection issues
Check that the backend WebSocket server is running at the configured URL.

## 📄 License

MIT
