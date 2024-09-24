// newChatSlice.js
import { createSlice } from '@reduxjs/toolkit';

const newChatSlice = createSlice({
  name: 'newChat',
  initialState: null, // Initially, no temporary chat exists
  reducers: {
    setNewChat: (state, action) => action.payload, // Set the temporary chat
    clearNewChat: () => null, // Clear the temporary chat if no message is sent
  },
});

export const { setNewChat, clearNewChat } = newChatSlice.actions;
export default newChatSlice.reducer;
