import { createSlice } from '@reduxjs/toolkit';

// ✅ Helper to safely get from localStorage (works only on client)
const getStoredUser = () => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('user');
    try {
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }
  return null;
};

const initialState = {
  user: getStoredUser(),
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(action.payload));
      }
    },
    logout: (state) => {
      state.user = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
        localStorage.removeItem('ringoToken'); // JWT token
        sessionStorage.removeItem('openChat'); // Clear chat data
      }
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
