import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { MOCK_CHATS, MOCK_MESSAGES } from '@utils/mockData';

// Async thunks
export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (chatId, { getState, rejectWithValue }) => {
    await new Promise(r => setTimeout(r, 500));
    return { chatId, messages: MOCK_MESSAGES };
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ chatId, content, attachments = [], replyTo = null }, { getState, rejectWithValue }) => {
    const { auth } = getState();
    await new Promise(r => setTimeout(r, 300));
    return {
      id: 'm-' + Date.now(),
      content,
      sender: {
        id: auth.user?.id || 'u1',
        username: auth.user?.username || 'johndoe',
        avatar: auth.user?.avatar
      },
      timestamp: new Date().toISOString(),
      type: 'text',
      attachments,
      reactions: [],
      replyTo
    };
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    activeChat: MOCK_CHATS[0],
    messages: {
      [MOCK_CHATS[0].id]: MOCK_MESSAGES
    },
    typingUsers: {},
    unreadCounts: {
      [MOCK_CHATS[0].id]: 2,
      [MOCK_CHATS[1].id]: 0
    },
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
    addReaction: (state, action) => {
      const { chatId, messageId, emoji, user } = action.payload;
      if (state.messages[chatId]) {
        const message = state.messages[chatId].find((m) => m.id === messageId);
        if (message) {
          const existingReaction = message.reactions.find((r) => r.emoji === emoji);
          if (existingReaction) {
            if (!existingReaction.users.some((u) => u.id === user.id)) {
              existingReaction.users.push(user);
            }
          } else {
            message.reactions.push({ emoji, users: [user] });
          }
        }
      }
    },
    removeReaction: (state, action) => {
      const { chatId, messageId, emoji, userId } = action.payload;
      if (state.messages[chatId]) {
        const message = state.messages[chatId].find((m) => m.id === messageId);
        if (message) {
          const reaction = message.reactions.find((r) => r.emoji === emoji);
          if (reaction) {
            reaction.users = reaction.users.filter((u) => u.id !== userId);
            if (reaction.users.length === 0) {
              message.reactions = message.reactions.filter((r) => r.emoji !== emoji);
            }
          }
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        const { chatId, messages } = action.payload;
        state.messages[chatId] = messages;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        const chatId = state.activeChat?.id;
        if (chatId && !state.messages[chatId]) {
          state.messages[chatId] = [];
        }
        if (chatId) {
          state.messages[chatId].push(action.payload);
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
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
  addReaction,
  removeReaction,
} = chatSlice.actions;

export default chatSlice.reducer;
