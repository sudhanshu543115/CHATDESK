import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    activeChat: null, // Start with no selection
    messages: {},
    typingUsers: {},
    unreadCounts: {},
    loading: false,
    error: null,
  },
  reducers: {
    setActiveChat: (state, action) => {
      state.activeChat = action.payload;
    },
    addMessage: (state, action) => {
      const { chatId, message } = action.payload;
      if (!state.messages[chatId]) {
        state.messages[chatId] = [];
      }
      state.messages[chatId].push(message);
    },
    updateMessage: (state, action) => {
      const { chatId, messageId, updates } = action.payload;
      if (state.messages[chatId]) {
        const message = state.messages[chatId].find((m) => m.id === messageId);
        if (message) {
          Object.assign(message, updates);
        }
      }
    },
    deleteMessage: (state, action) => {
      const { chatId, messageId } = action.payload;
      if (state.messages[chatId]) {
        state.messages[chatId] = state.messages[chatId].filter((m) => m.id !== messageId);
      }
    },
    setTypingUser: (state, action) => {
      const { chatId, userId, isTyping } = action.payload;
      if (!state.typingUsers[chatId]) {
        state.typingUsers[chatId] = [];
      }
      if (isTyping) {
        if (!state.typingUsers[chatId].includes(userId)) {
          state.typingUsers[chatId].push(userId);
        }
      } else {
        state.typingUsers[chatId] = state.typingUsers[chatId].filter((id) => id !== userId);
      }
    },
    setUnreadCount: (state, action) => {
      const { chatId, count } = action.payload;
      state.unreadCounts[chatId] = count;
    },
    clearTypingUsers: (state, action) => {
      const { chatId } = action.payload;
      state.typingUsers[chatId] = [];
    },
  },
});

export const {
  setActiveChat,
  addMessage,
  updateMessage,
  deleteMessage,
  setTypingUser,
  setUnreadCount,
  clearTypingUsers,
} = chatSlice.actions;

export default chatSlice.reducer;
