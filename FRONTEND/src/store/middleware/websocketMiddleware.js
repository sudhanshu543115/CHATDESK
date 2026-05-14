import { io } from 'socket.io-client';

let socket = null;

const websocketMiddleware = (store) => (next) => (action) => {
  // Handle WebSocket connection
  if (action.type === 'auth/setToken' && action.payload) {
    if (socket) {
      socket.disconnect();
    }

    socket = io('http://localhost:8000', {
      auth: {
        token: action.payload,
      },
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    socket.on('message_new', (data) => {
      store.dispatch({
        type: 'chat/addMessage',
        payload: { chatId: data.chatId, message: data.message },
      });
    });

    socket.on('message_updated', (data) => {
      store.dispatch({
        type: 'chat/updateMessage',
        payload: { chatId: data.chatId, messageId: data.messageId, updates: data.updates },
      });
    });

    socket.on('message_deleted', (data) => {
      store.dispatch({
        type: 'chat/deleteMessage',
        payload: { chatId: data.chatId, messageId: data.messageId },
      });
    });

    socket.on('user_typing', (data) => {
      store.dispatch({
        type: 'chat/setTypingUser',
        payload: { chatId: data.chatId, userId: data.userId, isTyping: data.isTyping },
      });
    });

    socket.on('notification_new', (data) => {
      store.dispatch({
        type: 'notification/addNotification',
        payload: data.notification,
      });
    });

    socket.on('user_presence', (data) => {
      store.dispatch({
        type: 'user/updateUserOnlineStatus',
        payload: { userId: data.userId, isOnline: data.isOnline, lastSeen: data.lastSeen },
      });
    });
  }

  // Handle logout
  if (action.type === 'auth/logout') {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  }

  // Handle sending messages via WebSocket
  if (action.type === 'chat/sendMessage/pending') {
    if (socket && socket.connected) {
      socket.emit('message_send', action.meta.arg);
    }
  }

  // Handle typing indicators
  if (action.type === 'chat/startTyping') {
    if (socket && socket.connected) {
      socket.emit('typing_start', { chatId: action.payload.chatId });
    }
  }

  if (action.type === 'chat/stopTyping') {
    if (socket && socket.connected) {
      socket.emit('typing_stop', { chatId: action.payload.chatId });
    }
  }

  return next(action);
};

export default websocketMiddleware;
