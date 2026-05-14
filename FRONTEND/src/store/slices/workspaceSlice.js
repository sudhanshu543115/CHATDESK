import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { MOCK_WORKSPACES, MOCK_CHANNELS, MOCK_GROUPS } from '@utils/mockData';

// Async thunks
export const fetchWorkspaces = createAsyncThunk(
  'workspace/fetchWorkspaces',
  async (_, { getState, rejectWithValue }) => {
    // Static mode: return mock data
    await new Promise(r => setTimeout(r, 500));
    return MOCK_WORKSPACES;
  }
);

export const createWorkspace = createAsyncThunk(
  'workspace/createWorkspace',
  async ({ name, description }, { getState, rejectWithValue }) => {
    await new Promise(r => setTimeout(r, 500));
    return {
      id: 'ws-' + Date.now(),
      name,
      description,
      avatar: null,
      isOwner: true
    };
  }
);

export const switchWorkspace = createAsyncThunk(
  'workspace/switchWorkspace',
  async (workspaceId, { getState, rejectWithValue }) => {
    await new Promise(r => setTimeout(r, 300));
    const ws = MOCK_WORKSPACES.find(w => w.id === workspaceId) || MOCK_WORKSPACES[0];
    return {
      ...ws,
      channels: MOCK_CHANNELS,
      groups: MOCK_GROUPS
    };
  }
);

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState: {
    currentWorkspace: MOCK_WORKSPACES[0],
    workspaces: MOCK_WORKSPACES,
    channels: MOCK_CHANNELS,
    groups: MOCK_GROUPS,
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentWorkspace: (state, action) => {
      state.currentWorkspace = action.payload;
    },
    addChannel: (state, action) => {
      state.channels.push(action.payload);
    },
    removeChannel: (state, action) => {
      state.channels = state.channels.filter((c) => c.id !== action.payload);
    },
    addGroup: (state, action) => {
      state.groups.push(action.payload);
    },
    removeGroup: (state, action) => {
      state.groups = state.groups.filter((g) => g.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkspaces.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWorkspaces.fulfilled, (state, action) => {
        state.loading = false;
        state.workspaces = action.payload;
      })
      .addCase(fetchWorkspaces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createWorkspace.fulfilled, (state, action) => {
        state.workspaces.push(action.payload);
      })
      .addCase(switchWorkspace.fulfilled, (state, action) => {
        state.currentWorkspace = action.payload;
        state.channels = action.payload.channels || [];
        state.groups = action.payload.groups || [];
      });
  },
});

export const {
  setCurrentWorkspace,
  addChannel,
  removeChannel,
  addGroup,
  removeGroup,
} = workspaceSlice.actions;

export default workspaceSlice.reducer;
