import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// -------------------- Types --------------------
export interface FileData {
  fileUrl: string;
  fileType: string;
  fileMimeType: string;
}

export interface Message {
  chat: string; // chat ID
  sender: string;
  content: string;
  file?: FileData | null;
  timestamp: string;
  seenBy?: string[];
  updatedAt?: string | null;
  status?: "sending" | "received"; // optional, for internal use
}

export interface User {
  _id: string;
  username: string;
  profilePicture: string;
}

export interface Chat {
  _id: string;
  participants: User[];
  messages: Message[];
  lastMessage?: Message;
  unreadCount?: number;
}

interface ChatsState {
  chats: Chat[];
  chatIndex: Record<string, number>; // chatId -> index
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// -------------------- Thunk --------------------
export const fetchUserChats = createAsyncThunk<
  Chat[],
  string,
  { rejectValue: string }
>("chats/fetchUserChats", async (token, { rejectWithValue }) => {
  try {
    const response = await fetch("http://localhost:5000/chat/getUserChats", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Failed to fetch chats");

    const data = await response.json();
    return data;
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

// -------------------- Slice --------------------
const initialState: ChatsState = {
  chats: [],
  chatIndex: {},
  status: "idle",
  error: null,
};

const chatsSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    setChats: (state, action: PayloadAction<Chat[]>) => {
      state.chats = action.payload;
      state.chatIndex = action.payload.reduce((map, chat, index) => {
        map[chat._id] = index;
        return map;
      }, {} as Record<string, number>);
    },
    addChat: (state, action: PayloadAction<Chat>) => {
      const newChat = action.payload;
      state.chats.push(newChat);
      state.chatIndex[newChat._id] = state.chats.length - 1;
    },
    addMessageToChatForSender: (
      state,
      action: PayloadAction<{ message: Message; currentUserId: string }>
    ) => {
      const { message, currentUserId } = action.payload;
      const chatIndex = state.chatIndex[message.chat];
      if (chatIndex !== undefined && currentUserId === message.sender) {
        const chatToUpdate = state.chats[chatIndex];
        const newMessage: Message = { ...message, status: "sending" };
        chatToUpdate.messages.push(newMessage);
        chatToUpdate.lastMessage = newMessage;
      }
    },
    addMessageToChatForReceiver: (
      state,
      action: PayloadAction<{ message: Message; currentUserId: string }>
    ) => {
      const { message, currentUserId } = action.payload;
      const chatIndex = state.chatIndex[message.chat];
      if (chatIndex !== undefined && currentUserId !== message.sender) {
        const chatToUpdate = state.chats[chatIndex];
        const newMessage: Message = { ...message, status: "received" };
        chatToUpdate.messages.push(newMessage);
        chatToUpdate.lastMessage = newMessage;
        chatToUpdate.unreadCount = (chatToUpdate.unreadCount || 0) + 1;
      }
    },
    updateLastMessage: (state, action: PayloadAction<Message>) => {
      const { chat } = action.payload;
      const chatIndex = state.chatIndex[chat];
      if (chatIndex !== undefined) {
        state.chats[chatIndex].lastMessage = action.payload;
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
        state.status = "loading";
      })
      .addCase(fetchUserChats.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.chats = action.payload;
        state.chatIndex = action.payload.reduce((map, chat, index) => {
          map[chat._id] = index;
          return map;
        }, {} as Record<string, number>);
      })
      .addCase(fetchUserChats.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Unknown error";
      });
  },
});

// -------------------- Selector --------------------
export const selectMessagesByChatId = (state: { chats: ChatsState }, chatId: string) => {
  const chatIndex = state.chats.chatIndex[chatId];
  return chatIndex !== undefined ? state.chats.chats[chatIndex]?.messages || [] : [];
};

// -------------------- Exports --------------------
export const {
  setChats,
  addChat,
  addMessageToChatForSender,
  addMessageToChatForReceiver,
  updateLastMessage,
  clearChats,
} = chatsSlice.actions;

export default chatsSlice.reducer;
