import { createSlice } from '@reduxjs/toolkit';

// ✅ Helper to safely get from sessionStorage (works only on client)
const getStoredChat = () => {
  if (typeof window !== 'undefined') {
    const stored = sessionStorage.getItem('openChat');
    try {
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }
  return null;
};

const savedChat = getStoredChat();

const initialState = {
  chat: savedChat?.chat || null,
  temporary: savedChat?.temporary || false,
};

// ✅ If messages exist in savedChat, preserve them
if (savedChat?.chat?.messages) {
  initialState.chat = {
    ...initialState.chat,
    messages: savedChat.chat.messages,
  };
}

const openChatSlice = createSlice({
  name: 'openChat',
  initialState,
  reducers: {
    setOpenChat: (state, action) => {
      const { chat, temporary } = action.payload;
      state.chat = chat;
      state.temporary = temporary;
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('openChat', JSON.stringify(state));
      }
    },
    clearOpenChat: (state) => {
      state.chat = null;
      state.temporary = false;
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('openChat');
      }
    },
  },
});

export const { setOpenChat, clearOpenChat } = openChatSlice.actions;
export default openChatSlice.reducer;
