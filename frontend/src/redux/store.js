import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import loadingReducer from './loadingSlice';
import openChatReducer from './openChatSlice';
import newChatReducer from './newChatSlice';
import messagesReducer from './messagesSlice'; // Import the messages slice
import chatsReducer from './chatsSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    loading: loadingReducer,
    openChat: openChatReducer,
    newChat: newChatReducer,
    messages: messagesReducer, // Add messages reducer
    chats: chatsReducer
  },
});

export default store;
