// openChatSlice.js
import { createSlice } from '@reduxjs/toolkit';

const openChatSlice = createSlice({
  name: 'openChat',
  initialState: {
    chat: null, // Store the entire chat object
    temporary: false, // Flag to indicate if the chat is temporary
  },
  reducers: {
    setOpenChat: (state, action) => {
      const { chat, temporary } = action.payload;
      state.chat = chat;
      state.temporary = temporary;
    },
    clearOpenChat: (state) => {
      state.chat = null;
      state.temporary = false;
    },
  },
});

export const { setOpenChat, clearOpenChat } = openChatSlice.actions;
export default openChatSlice.reducer;
