import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    theme: localStorage.getItem('theme') || 'dark',
    sidebarCollapsed: true,
    activeView: 'chats',
    modalOpen: null,
    searchQuery: '',
    searchFilters: {
      type: 'all',
      dateRange: null,
    },
    chatListFilter: 'all',
  },
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
      // Apply theme to document
      if (action.payload === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setActiveView: (state, action) => {
      state.activeView = action.payload;
    },
    setSidebarCollapsed: (state, action) => {
      state.sidebarCollapsed = action.payload;
    },
    openModal: (state, action) => {
      state.modalOpen = action.payload;
    },
    closeModal: (state) => {
      state.modalOpen = null;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSearchFilters: (state, action) => {
      state.searchFilters = { ...state.searchFilters, ...action.payload };
    },
    setChatListFilter: (state, action) => {
      state.chatListFilter = action.payload;
    },
  },
});

export const {
  setTheme,
  toggleSidebar,
  setActiveView,
  setSidebarCollapsed,
  openModal,
  closeModal,
  setSearchQuery,
  setSearchFilters,
  setChatListFilter,
} = uiSlice.actions;

export default uiSlice.reducer;
