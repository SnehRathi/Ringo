import { createSlice } from '@reduxjs/toolkit';

// Load initial state from sessionStorage if it exists
const initialState = {
  chat: JSON.parse(sessionStorage.getItem('openChat'))?.chat || null, // Get chat from sessionStorage or default to null
  temporary: JSON.parse(sessionStorage.getItem('openChat'))?.temporary || false, // Get temporary status from sessionStorage or default to false
};

const openChatSlice = createSlice({
  name: 'openChat',
  initialState,
  reducers: {
    setOpenChat: (state, action) => {
      const { chat, temporary } = action.payload;
      state.chat = chat;
      state.temporary = temporary;

      // Save the entire chat object and temporary flag in sessionStorage
      sessionStorage.setItem('openChat', JSON.stringify({ chat, temporary }));
    },
    clearOpenChat: (state) => {
      state.chat = null;
      state.temporary = false;

      // Remove openChat from sessionStorage
      sessionStorage.removeItem('openChat');
    },
  },
});

export const { setOpenChat, clearOpenChat } = openChatSlice.actions;
export default openChatSlice.reducer;
