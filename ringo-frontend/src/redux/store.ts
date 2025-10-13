import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import loadingReducer from './loadingSlice';
import openChatReducer from './openChatSlice';
import newChatReducer from './newChatSlice';
import chatsReducer from './chatsSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    loading: loadingReducer,
    openChat: openChatReducer,
    newChat: newChatReducer,
    chats: chatsReducer,
  },
});

// ✅ Types for TS
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
