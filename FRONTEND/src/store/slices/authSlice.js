import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // Static mock login for development
      console.log('Performing static login for:', email);
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate delay
      
      return {
        token: 'static-dev-token-' + Date.now(),
        user: {
          id: 'dev-user-1',
          email: email || 'dev@example.com',
          username: email ? email.split('@')[0] : 'dev_user',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dev',
          status: 'online',
          displayName: 'Developer Mode'
        }
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      // Static mock register for development
      await new Promise(resolve => setTimeout(resolve, 800));
      return {
        token: 'static-dev-token-' + Date.now(),
        user: {
          id: 'dev-user-new',
          email,
          username,
          avatar: null,
          status: 'online',
          displayName: username
        }
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('token');
  return null;
});

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { getState, rejectWithValue }) => {
    const { auth } = getState();
    if (auth.user) return auth.user;
    
    // Return static user if no backend
    return {
      id: 'dev-user-1',
      email: 'dev@example.com',
      username: 'dev_user',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dev',
      status: 'online',
      displayName: 'Developer Mode'
    };
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setToken: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = !!action.payload;
      if (action.payload) {
        localStorage.setItem('token', action.payload);
      } else {
        localStorage.removeItem('token');
      }
    },
    updateUserStatus: (state, action) => {
      if (state.user) {
        state.user.status = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem('token');
      })
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setToken, updateUserStatus } = authSlice.actions;
export default authSlice.reducer;
