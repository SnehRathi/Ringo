import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk to fetch user chats with unread count
export const fetchUserChats = createAsyncThunk(
  'chats/fetchUserChats',
  async (token, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:5000/chat/getUserChats', {
        headers: { Authorization: `Bearer ${token}` },
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
    chatIndex: {}, // Mapping of chatId to its index in the chats array
    status: 'idle',
    error: null,
  },
  reducers: {
    setChats: (state, action) => {
      state.chats = action.payload;
      state.chatIndex = action.payload.reduce((map, chat, index) => {
        map[chat._id] = index;
        return map;
      }, {});
    },
    addChat: (state, action) => {
      const newChat = action.payload;
      state.chats.push(newChat);
      state.chatIndex[newChat._id] = state.chats.length - 1;
    },
    addMessageToChatForSender: (state, action) => {
      const { message, currentUserId } = action.payload;
      const { chat, sender, content, file, timestamp, seenBy, updatedAt } = message;

      const chatIndex = state.chatIndex[chat];
      if (chatIndex !== undefined && currentUserId === sender) {
        const chatToUpdate = state.chats[chatIndex];

        const newMessage = {
          sender,
          content,
          file: file
            ? {
              fileUrl: file.fileUrl,
              fileType: file.fileType,
              fileMimeType: file.fileMimeType,
            }
            : null,
          timestamp,
          seenBy: seenBy || [],
          updatedAt: updatedAt || null,
          status: 'sending', // Initial status for the sender
        };

        chatToUpdate.messages.push(newMessage);
        chatToUpdate.lastMessage = {
          sender,
          content,
          file: newMessage.file,
          timestamp,
          updatedAt: updatedAt || null,
        };
      }
    },

    addMessageToChatForReceiver: (state, action) => {
      const { message, currentUserId } = action.payload;
      const { chat, sender, content, file, timestamp, seenBy, updatedAt } = message;

      const chatIndex = state.chatIndex[chat];
      if (chatIndex !== undefined && currentUserId !== sender) {
        const chatToUpdate = state.chats[chatIndex];

        const newMessage = {
          sender,
          content,
          file: file
            ? {
              fileUrl: file.fileUrl,
              fileType: file.fileType,
              fileMimeType: file.fileMimeType,
            }
            : null,
          timestamp,
          seenBy: seenBy || [],
          updatedAt: updatedAt || null,
          status: 'received', // Initial status for the receiver
        };

        chatToUpdate.messages.push(newMessage);
        chatToUpdate.lastMessage = {
          sender,
          content,
          file: newMessage.file,
          timestamp,
          updatedAt: updatedAt || null,
        };

        if (currentUserId !== sender) {
          chatToUpdate.unreadCount = (chatToUpdate.unreadCount || 0) + 1;
        }
      }
    },
    updateLastMessage: (state, action) => {
      const { chat, sender, content, file, timestamp, updatedAt } = action.payload;
      const chatIndex = state.chatIndex[chat];
      if (chatIndex !== undefined) {
        const chatToUpdate = state.chats[chatIndex];
        chatToUpdate.lastMessage = {
          sender,
          content,
          file: file ? {
            fileUrl: file.fileUrl,
            fileType: file.fileType,
            fileMimeType: file.fileMimeType,
          } : null,
          timestamp,
          updatedAt: updatedAt || null,
        };
      }
    },
    clearChats: (state) => {
      state.chats = [];
      state.chatIndex = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserChats.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserChats.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.chats = action.payload;
        state.chatIndex = action.payload.reduce((map, chat, index) => {
          map[chat._id] = index;
          return map;
        }, {});
      })
      .addCase(fetchUserChats.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

// Create a memoized selector to get messages by chatId
export const selectMessagesByChatId = (state, chatId) => {
  const chatIndex = state.chats.chatIndex[chatId];
  return chatIndex !== undefined ? state.chats.chats[chatIndex]?.messages || [] : [];
};

export const { setChats, addChat, addMessageToChatForSender, addMessageToChatForReceiver, updateLastMessage, clearChats } = chatsSlice.actions;
export default chatsSlice.reducer;
