import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { MOCK_CHATS, MOCK_USER } from '@utils/mockData';

// Async thunks
export const fetchContacts = createAsyncThunk(
  'user/fetchContacts',
  async (_, { getState, rejectWithValue }) => {
    await new Promise(r => setTimeout(r, 500));
    // Transform mock chats into contacts for display
    return MOCK_CHATS.map(chat => ({
      id: chat.id,
      username: chat.name.toLowerCase().replace(' ', '_'),
      displayName: chat.name,
      avatar: chat.avatar,
      status: chat.status,
      lastSeen: new Date().toISOString()
    }));
  }
);

export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async ({ username, avatar }, { getState, rejectWithValue }) => {
    await new Promise(r => setTimeout(r, 500));
    return { id: 'u1', username, avatar };
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    profile: MOCK_USER,
    contacts: MOCK_CHATS.map(chat => ({
      id: chat.id,
      username: chat.name.toLowerCase().replace(' ', '_'),
      displayName: chat.name,
      avatar: chat.avatar,
      status: chat.status,
      lastSeen: new Date().toISOString()
    })),
    onlineUsers: ['dm1'],
    loading: false,
    error: null,
  },
  reducers: {
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    updateUserOnlineStatus: (state, action) => {
      const { userId, isOnline, lastSeen } = action.payload;
      const contact = state.contacts.find((c) => c.id === userId);
      if (contact) {
        contact.status = isOnline ? 'online' : 'offline';
        contact.lastSeen = lastSeen;
      }
    },
    addContact: (state, action) => {
      state.contacts.push(action.payload);
    },
    removeContact: (state, action) => {
      state.contacts = state.contacts.filter((c) => c.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = action.payload;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profile = { ...state.profile, ...action.payload };
      });
  },
});

export const { setOnlineUsers, updateUserOnlineStatus, addContact, removeContact } = userSlice.actions;
export default userSlice.reducer;
