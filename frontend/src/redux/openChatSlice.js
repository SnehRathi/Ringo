import { createSlice } from '@reduxjs/toolkit';

// Load initial state from sessionStorage if it exists
const initialState = {
  chat: JSON.parse(sessionStorage.getItem('openChat'))?.chat || null,
  temporary: JSON.parse(sessionStorage.getItem('openChat'))?.temporary || false,
};

// Check if there is an open chat and load messages from it
const savedChat = JSON.parse(sessionStorage.getItem('openChat'));
if (savedChat && savedChat.chat && savedChat.chat.messages) {
  initialState.chat.messages = savedChat.chat.messages; // Set messages to those in the open chat
}

const openChatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setOpenChat: (state, action) => {
      const { chat, temporary } = action.payload;
      state.chat = chat;
      state.temporary = temporary;

      // Save the entire chat object and temporary flag in sessionStorage
      sessionStorage.setItem('openChat', JSON.stringify({ ...state, chat, temporary }));
    },
    clearOpenChat: (state) => {
      state.chat = null;
      state.temporary = false;

      // Remove openChat from sessionStorage
      sessionStorage.removeItem('openChat');
    },
    setMessages: (state, action) => {
      if (state.chat) {
        
        state.chat.messages = action.payload; // Replaces the entire messages array within chat
        sessionStorage.setItem('openChat', JSON.stringify({ ...state, chat: state.chat })); // Save chat with messages to session storage
      }
    },
    clearMessages: (state) => {
      if (state.chat) {
        state.chat.messages = []; // Clears all messages in chat
        sessionStorage.setItem('openChat', JSON.stringify({ ...state, chat: state.chat })); // Clear messages in session storage
      }
    },
    addPendingMessage: (state, action) => {
      if (state.chat) {
        state.chat.messages.push({
          ...action.payload,
          status: 'sending',
        });
        sessionStorage.setItem('openChat', JSON.stringify({ ...state, chat: state.chat })); // Update session storage
      }
    },
    // addMessage: (state, action) => {
    //   if (state.chat) {
    //     state.chat.messages.push({
    //       ...action.payload,
    //       status: 'received',
    //     });
    //     sessionStorage.setItem('openChat', JSON.stringify({ ...state, chat: state.chat })); // Update session storage
    //   }
    // },
  },
});

export const { setOpenChat, clearOpenChat, setMessages, clearMessages, addPendingMessage, addMessage } = openChatSlice.actions;
export default openChatSlice.reducer;