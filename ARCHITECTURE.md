# ChatDesk - Architecture Documentation

## 📋 Overview
Modern real-time desktop chat application inspired by Zoho Cliq and Slack for personal/team communication.

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     ELECTRON DESKTOP APP                    │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              REACT FRONTEND                            │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │  │
│  │  │   UI Layer   │  │  Redux Store │  │  WebSocket  │ │  │
│  │  │  Components  │  │   State Mgmt │  │   Client    │ │  │
│  │  └──────────────┘  └──────────────┘  └─────────────┘ │  │
│  └───────────────────────────────────────────────────────┘  │
│                         ↓                                    │
│                  GraphQL API Layer                          │
│                         ↓                                    │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                  FASTAPI BACKEND SERVER                     │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │  │
│  │  │ GraphQL API  │  │  WebSocket   │  │  File Upload │ │  │
│  │  │  (Strawberry)│  │   Server     │  │   Handler    │ │  │
│  │  └──────────────┘  └──────────────┘  └─────────────┘ │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │  │
│  │  │   JWT Auth   │  │  Notification│  │  Business   │ │  │
│  │  │   Service    │  │   Engine     │  │   Logic     │ │  │
│  │  └──────────────┘  └──────────────┘  └─────────────┘ │  │
│  └───────────────────────────────────────────────────────┘  │
│                         ↓                                    │
│                  PostgreSQL Database                         │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 Technology Stack

### Frontend
- **Framework**: React 18.x
- **Desktop**: Electron 28.x
- **State Management**: Redux Toolkit
- **Styling**: TailwindCSS + shadcn/ui
- **Icons**: Lucide Icons
- **Real-time**: Native WebSocket Client
- **Build Tool**: Vite

### Backend
- **Framework**: FastAPI 0.104.x
- **API Layer**: GraphQL (Strawberry)
- **Database**: PostgreSQL 15.x
- **ORM**: SQLAlchemy 2.x (async)
- **Real-time**: WebSockets (FastAPI native)
- **Authentication**: JWT (python-jose)
- **File Storage**: Local filesystem + Cloud (optional)

## 📁 Folder Structure

```
CHAT DESK/
├── FRONTEND/
│   ├── electron/
│   │   ├── main/
│   │   │   ├── index.cjs              # Electron main process
│   │   │   ├── window-manager.js     # Window management
│   │   │   ├── tray-manager.js       # System tray
│   │   │   ├── notification-manager.js
│   │   │   └── ipc-handlers.js       # IPC communication
│   │   ├── preload/
│   │   │   └── preload.cjs            # Secure preload script
│   │   └── resources/                # App icons, assets
│   ├── src/
│   │   ├── App.jsx                   # Root component
│   │   ├── main.jsx                  # React entry point
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   ├── RegisterForm.jsx
│   │   │   │   └── ForgotPassword.jsx
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── ChatListPanel.jsx
│   │   │   │   └── MainLayout.jsx
│   │   │   ├── chat/
│   │   │   │   ├── ChatWindow.jsx
│   │   │   │   ├── MessageList.jsx
│   │   │   │   ├── MessageItem.jsx
│   │   │   │   ├── MessageInput.jsx
│   │   │   │   ├── TypingIndicator.jsx
│   │   │   │   └── MessageReactions.jsx
│   │   │   ├── groups/
│   │   │   │   ├── GroupList.jsx
│   │   │   │   ├── GroupCard.jsx
│   │   │   │   ├── CreateGroupModal.jsx
│   │   │   │   └── GroupSettings.jsx
│   │   │   ├── channels/
│   │   │   │   ├── ChannelList.jsx
│   │   │   │   ├── ChannelItem.jsx
│   │   │   │   └── CreateChannelModal.jsx
│   │   │   ├── files/
│   │   │   │   ├── FileUpload.jsx
│   │   │   │   ├── FilePreview.jsx
│   │   │   │   └── FileAttachment.jsx
│   │   │   ├── notifications/
│   │   │   │   ├── NotificationBadge.jsx
│   │   │   │   ├── NotificationPanel.jsx
│   │   │   │   └── NotificationItem.jsx
│   │   │   ├── search/
│   │   │   │   ├── SearchBar.jsx
│   │   │   │   ├── SearchResults.jsx
│   │   │   │   └── SearchFilters.jsx
│   │   │   ├── profile/
│   │   │   │   ├── UserProfile.jsx
│   │   │   │   ├── ProfileSettings.jsx
│   │   │   │   └── AvatarUpload.jsx
│   │   │   ├── workspace/
│   │   │   │   ├── WorkspaceSwitcher.jsx
│   │   │   │   └── WorkspaceSettings.jsx
│   │   │   └── common/
│   │   │       ├── Button.jsx
│   │   │       ├── Input.jsx
│   │   │       ├── Modal.jsx
│   │   │       ├── Dropdown.jsx
│   │   │       ├── Avatar.jsx
│   │   │       └── LoadingSpinner.jsx
│   │   ├── store/
│   │   │   ├── index.js                # Redux store configuration
│   │   │   ├── slices/
│   │   │   │   ├── authSlice.js
│   │   │   │   ├── chatSlice.js
135: │   │   │   │   ├── userSlice.js
136: │   │   │   │   ├── notificationSlice.js
137: │   │   │   │   ├── workspaceSlice.js
138: │   │   │   │   └── uiSlice.js
139: │   │   │   └── middleware/
140: │   │   │       ├── websocketMiddleware.js
141: │   │   │       └── authMiddleware.js
142: │   │   ├── services/
143: │   │   │   ├── graphql/
144: │   │   │   │   ├── client.js           # GraphQL client setup
145: │   │   │   │   ├── queries.js          # GraphQL queries
146: │   │   │   │   └── mutations.js        # GraphQL mutations
147: │   │   │   ├── websocket/
148: │   │   │   │   ├── websocketClient.js  # WebSocket client
149: │   │   │   │   └── eventHandlers.js    # WS event handlers
150: │   │   │   ├── api/
151: │   │   │   │   └── httpClient.js       # HTTP client for REST
152: │   │   │   └── storage/
153: │   │   │       ├── localStorage.js
154: │   │   │       └── indexedDB.js
155: │   │   ├── utils/
156: │   │   │   ├── formatters.js
157: │   │   │   ├── validators.js
158: │   │   │   ├── constants.js
159: │   │   │   └── helpers.js
160: │   │   ├── styles/
161: │   │   │   ├── globals.css
162: │   │   │   ├── themes/
163: │   │   │   │   ├── dark.css
164: │   │   │   │   └── light.css
165: │   │   │   └── components.css
166: │   │   └── assets/
167: │   │       ├── images/
168: │   │       ├── icons/
169: │   │       └── sounds/
170: │   ├── public/
171: │   │   └── favicon.ico
172: │   ├── package.json
173: │   ├── vite.config.js
174: │   └── tailwind.config.js
175: ├── BACKEND/
176: │   ├── app/
177: │   │   ├── main.py                    # FastAPI application entry
178: │   │   ├── config.py                  # Configuration settings
179: │   │   ├── database.py                # Database connection
180: │   │   ├── models/
181: │   │   │   ├── __init__.py
182: │   │   │   ├── user.py
183: │   │   │   ├── message.py
184: │   │   │   ├── group.py
185: │   │   │   ├── channel.py
186: │   │   │   ├── workspace.py
187: │   │   │   ├── notification.py
188: │   │   │   └── file.py
189: │   │   ├── schemas/
190: │   │   │   ├── __init__.py
191: │   │   │   ├── user.py
192: │   │   │   ├── message.py
193: │   │   │   └── group.py
194: │   │   ├── graphql/
195: │   │   │   ├── __init__.py
196: │   │   │   ├── schema.py              # Main GraphQL schema
197: │   │   │   ├── queries/
198: │   │   │   │   ├── __init__.py
199: │   │   │   │   ├── user.py
200: │   │   │   │   ├── message.py
201: │   │   │   │   └── group.py
202: │   │   │   ├── mutations/
203: │   │   │   │   ├── __init__.py
204: │   │   │   │   ├── auth.py
205: │   │   │   │   ├── message.py
206: │   │   │   │   └── group.py
207: │   │   │   ├── subscriptions/
208: │   │   │   │   ├── __init__.py
209: │   │   │   │   └── message.py
210: │   │   │   └── types/
211: │   │   │       ├── __init__.py
212: │   │   │       ├── user.py
213: │   │   │       ├── message.py
214: │   │   │       └── group.py
215: │   │   ├── api/
216: │   │   │   ├── __init__.py
217: │   │   │   ├── auth.py                # Authentication endpoints
218: │   │   │   ├── upload.py              # File upload endpoints
219: │   │   │   └── websocket.py           # WebSocket endpoint
220: │   │   ├── services/
221: │   │   │   ├── __init__.py
222: │   │   │   ├── auth_service.py
223: │   │   │   ├── chat_service.py
224: │   │   │   ├── notification_service.py
225: │   │   │   ├── file_service.py
226: │   │   │   └── websocket_service.py
227: │   │   ├── core/
228: │   │   │   ├── __init__.py
229: │   │   │   ├── security.py            # JWT, password hashing
230: │   │   │   ├── permissions.py         # Role-based permissions
231: │   │   │   └── dependencies.py        # FastAPI dependencies
232: │   │   └── utils/
233: │   │       ├── __init__.py
234: │   │       ├── helpers.py
235: │   │       └── validators.py
236: │   ├── alembic/                       # Database migrations
237: │   │   ├── versions/
238: │   │   └── env.py
239: │   ├── uploads/                       # Uploaded files
240: │   ├── tests/
241: │   │   ├── __init__.py
242: │   │   ├── test_auth.py
243: │   │   ├── test_chat.py
244: │   │   └── test_websocket.py
245: │   ├── requirements.txt
246: │   ├── alembic.ini
247: │   └── .env.example
248: ├── docs/
249: │   ├── API.md
250: │   ├── DATABASE.md
251: │   ├── DEPLOYMENT.md
252: │   └── DEVELOPMENT.md
253: ├── .gitignore
254: └── README.md
255: ```

## 🔐 Security Architecture

### Authentication Flow
1. User submits credentials → GraphQL mutation
2. Server validates credentials → Issues JWT token
3. Token stored in Electron secure storage
4. All subsequent requests include JWT in Authorization header
5. WebSocket connection authenticates via token query parameter

### Data Security
- Passwords hashed with bcrypt
- JWT tokens with expiration (access: 15min, refresh: 7days)
- Secure preload scripts in Electron
- SQL injection prevention via ORM
- XSS prevention via React's built-in escaping
- CSRF protection via token validation

## 🔄 Real-Time Communication

### WebSocket Events
```javascript
// Client → Server
{
  type: "message_send",
  data: { chat_id, content, attachments }
}

{
  type: "typing_start",
  data: { chat_id }
}

{
  type: "typing_stop",
  data: { chat_id }
}

// Server → Client
{
  type: "message_new",
  data: { message, sender }
}

{
  type: "message_updated",
  data: { message_id, updates }
}

{
  type: "message_deleted",
  data: { message_id }
}

{
  type: "user_typing",
  data: { user_id, chat_id }
}

{
  type: "notification_new",
  data: { notification }
}

{
  type: "user_presence",
  data: { user_id, status, last_seen }
}
```

## 📊 State Management (Redux Toolkit)

### Store Structure
```javascript
{
  auth: {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null
  },
  chat: {
    activeChat: null,
    messages: {},
    typingUsers: {},
    unreadCounts: {},
    loading: false
  },
  user: {
    profile: null,
    contacts: [],
    onlineUsers: [],
    loading: false
  },
  notification: {
    notifications: [],
    unreadCount: 0,
    soundEnabled: true
  },
  workspace: {
    currentWorkspace: null,
    workspaces: [],
    channels: [],
    groups: []
  },
  ui: {
    theme: 'dark',
    sidebarCollapsed: false,
    modalOpen: null,
    searchQuery: ''
  }
}
```

## 🎨 UI/UX Design Principles

### Design System
- **Primary Color**: #6366f1 (Indigo)
- **Secondary Color**: #8b5cf6 (Purple)
- **Success**: #10b981 (Green)
- **Warning**: #f59e0b (Amber)
- **Error**: #ef4444 (Red)
- **Dark Theme**: #0f172a (Slate 900)
- **Light Theme**: #ffffff (White)

### Layout Structure
```
┌─────────────────────────────────────────────────┐
│  Header (Workspace switcher, Search, Profile)   │
├──────────┬──────────────────────────────────────┤
│          │  Chat Header (Chat info, actions)    │
│ Sidebar  ├──────────────────────────────────────┤
│  - Work  │                                      │
│  - Chats │         Message List                 │
│  - Groups│         (Scrollable)                 │
│  - Users │                                      │
│          ├──────────────────────────────────────┤
│          │  Message Input + Attachments        │
└──────────┴──────────────────────────────────────┘
```

## 🚀 Performance Optimizations

### Frontend
- Virtual scrolling for message lists
- Lazy loading of chat history
- Image optimization and lazy loading
- Code splitting with dynamic imports
- Redux memoization with reselect

### Backend
- Database connection pooling
- Query optimization with indexes
- Redis caching for frequent queries
- Async/await for non-blocking I/O
- WebSocket connection management

## 📦 Deployment Architecture

### Development
```
Frontend: Vite dev server (localhost:5173)
Backend: FastAPI Uvicorn (localhost:8000)
Database: PostgreSQL (localhost:5432)
```

### Production
```
Electron App → Distributed via installer
Backend Server → Docker container + Nginx
Database → Managed PostgreSQL (RDS/Cloud SQL)
Files → CDN or object storage (S3)
```

## 🧪 Testing Strategy

### Frontend
- Unit tests with Vitest
- Component tests with Testing Library
- E2E tests with Playwright

### Backend
- Unit tests with pytest
- Integration tests with test database
- API tests with pytest-asyncio

## 📝 Development Workflow

1. **Feature Development**
   - Create feature branch
   - Implement frontend components
   - Implement backend API
   - Write tests
   - Create PR

2. **Code Review**
   - Review for security
   - Review for performance
   - Review for accessibility

3. **Deployment**
   - Merge to main
   - Run CI/CD pipeline
   - Deploy to staging
   - Test and deploy to production
