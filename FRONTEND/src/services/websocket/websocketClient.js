import { io } from 'socket.io-client';
import { store } from '@store/index';
import { addMessage, updateTypingStatus } from '@store/slices/chatSlice';
import { addNotification } from '@store/slices/notificationSlice';
import { setOnlineUsers } from '@store/slices/userSlice';

const WS_URL = import.meta.env.VITE_WS_BASE_URL || 'http://localhost:8000';

class WebSocketClient {
  constructor() {
    this.socket = null;
    this.token = null;
  }

  connect(token) {
    this.token = token;
    if (this.socket) {
      this.socket.disconnect();
    }

    this.socket = io(WS_URL, {
      auth: { token },
      transports: ['websocket'],
    });

    this.setupListeners();
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  setupListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    this.socket.on('message:new', (data) => {
      store.dispatch(addMessage(data));
    });

    this.socket.on('user:typing', (data) => {
      store.dispatch(updateTypingStatus(data));
    });

    this.socket.on('notification:new', (data) => {
      store.dispatch(addNotification(data));
    });

    this.socket.on('presence:update', (data) => {
      store.dispatch(setOnlineUsers(data));
    });
  }

  sendMessage(chatId, content, attachments = []) {
    if (this.socket) {
      this.socket.emit('message:send', { chatId, content, attachments });
    }
  }

  startTyping(chatId) {
    if (this.socket) {
      this.socket.emit('typing:start', { chatId });
    }
  }

  stopTyping(chatId) {
    if (this.socket) {
      this.socket.emit('typing:stop', { chatId });
    }
  }
}

export const wsClient = new WebSocketClient();
