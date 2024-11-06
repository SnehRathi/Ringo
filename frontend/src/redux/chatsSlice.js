import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk to fetch user chats with unread count
export const fetchUserChats = createAsyncThunk(
  'chats/fetchUserChats',
  async (token, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:5000/chat/getUserChats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch chats');
      }
      const data = await response.json();
      return data; // Chats along with unread count and last message
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const chatsSlice = createSlice({
  name: 'chats',
  initialState: {
    chats: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    addChat: (state, action) => {
      state.chats.push(action.payload);
    },
    // Directly update the chat without traversing all chats
    addMessageToChat: (state, action) => {
      console.log(action.payload);
      const { _id, chat, sender, content, file, timestamp, seenBy, updatedAt } = action.payload; // Destructure the message details
      const chatToUpdate = state.chats.find(existingChat => existingChat._id === chat); // Find the correct chat by chatId

      if (chatToUpdate) {
        const message = {
          messageId: _id, // Unique message ID
          sender: sender, // Sender ID
          content: content, // Message content
          file: file ? {
            fileUrl: file.fileUrl,
            fileType: file.fileType,
            fileMimeType: file.fileMimeType
          } : null, // File object if exists
          timestamp: timestamp, // Timestamp of when the message was created
          seenBy: seenBy || [], // Array of IDs who have seen the message
          updatedAt: updatedAt || null // Last updated timestamp
        };

        // Add new message to this specific chat
        chatToUpdate.messages.push(message);
        console.log(message);
        

        // Update lastMessage field with this new message
        chatToUpdate.lastMessage = {
          sender: sender,
          content: content,
          file: file ? {
            fileUrl: file.fileUrl,
            fileType: file.fileType,
            fileMimeType: file.fileMimeType
          } : null,
          timestamp: timestamp,
          updatedAt: updatedAt || null
        };
      }
    },

    updateLastMessage: (state, action) => {
      const { _id, chat, sender, content, file, timestamp, updatedAt } = action.payload; // Destructure the message details
      const chatToUpdate = state.chats.find(existingChat => existingChat._id === chat); // Find the correct chat by chatId

      if (chatToUpdate) {
        // Update the lastMessage field with the new message information
        chatToUpdate.lastMessage = {
          sender: sender,
          content: content,
          file: file ? {
            fileUrl: file.fileUrl,
            fileType: file.fileType,
            fileMimeType: file.fileMimeType
          } : null, // File object if exists
          timestamp: timestamp,
          updatedAt: updatedAt || null
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserChats.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserChats.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.chats = action.payload; // Store the fetched chats
      })
      .addCase(fetchUserChats.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { addChat, addMessageToChat, updateLastMessage } = chatsSlice.actions;
export default chatsSlice.reducer;