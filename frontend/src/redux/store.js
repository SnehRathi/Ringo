import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import loadingReducer from './loadingSlice';
import openChatReducer from './openChatSlice';
import newChatReducer from './newChatSlice';
import chatsReducer from './chatsSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    loading: loadingReducer,
    openChat: openChatReducer,
    newChat: newChatReducer,
    chats: chatsReducer,
  },
});

export default store;
