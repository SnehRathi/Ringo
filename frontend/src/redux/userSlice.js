import { createSlice } from '@reduxjs/toolkit';

// Load initial state from localStorage
const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('user');
      localStorage.removeItem('ringoToken'); // Removing JWT token
      sessionStorage.removeItem('openChat'); // Clearing chat data from sessionStorage
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;