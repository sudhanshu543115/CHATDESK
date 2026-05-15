import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import chatReducer from './slices/chatSlice';
import userReducer from './slices/userSlice';
import notificationReducer from './slices/notificationSlice';
import workspaceReducer from './slices/workspaceSlice';
import uiReducer from './slices/uiSlice';
import { chatApi } from './services/chatApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    user: userReducer,
    notification: notificationReducer,
    workspace: workspaceReducer,
    ui: uiReducer,
    [chatApi.reducerPath]: chatApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(chatApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
