import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import chatReducer from './slices/chatSlice';
import userReducer from './slices/userSlice';
import notificationReducer from './slices/notificationSlice';
import workspaceReducer from './slices/workspaceSlice';
import uiReducer from './slices/uiSlice';
import websocketMiddleware from './middleware/websocketMiddleware';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    user: userReducer,
    notification: notificationReducer,
    workspace: workspaceReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(websocketMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
