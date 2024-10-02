import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk to fetch user chats
export const fetchUserChats = createAsyncThunk('chats/fetchUserChats', async (token, { rejectWithValue }) => {
  try {
    const response = await fetch('http://localhost:5000/chat/getUserChats', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch chats');
    }
    const data = await response.json();
    // console.log(data);
    
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserChats.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserChats.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.chats = action.payload;
      })
      .addCase(fetchUserChats.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { addChat } = chatsSlice.actions;
export default chatsSlice.reducer;