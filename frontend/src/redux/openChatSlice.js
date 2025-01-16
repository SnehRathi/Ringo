import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  chat: JSON.parse(sessionStorage.getItem('openChat'))?.chat || null,
  temporary: JSON.parse(sessionStorage.getItem('openChat'))?.temporary || false,
};

const savedChat = JSON.parse(sessionStorage.getItem('openChat'));
if (savedChat && savedChat.chat && savedChat.chat.messages) {
  initialState.chat.messages = savedChat.chat.messages;
}

// Redux slice modifications
const openChatSlice = createSlice({
  name: 'openChat',
  initialState,
  reducers: {
    setOpenChat: (state, action) => {
      const { chat, temporary } = action.payload;
      state.chat = chat;
      state.temporary = temporary;
      sessionStorage.setItem('openChat', JSON.stringify(state));
    },
    clearOpenChat: (state) => {
      state.chat = null;
      state.temporary = false;
      sessionStorage.removeItem('openChat');
    },
  },
});

export const { setOpenChat, clearOpenChat } = openChatSlice.actions;

export default openChatSlice.reducer;