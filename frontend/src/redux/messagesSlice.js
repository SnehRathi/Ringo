import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    messages: [], // Stores all messages for the open chat
};

const messagesSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        setMessages(state, action) {
            state.messages = action.payload; // Replaces the entire messages array
        },
        clearMessages(state) {
            state.messages = []; // Clears all messages
        },
        addPendingMessage(state, action) {
            // console.log(action.payload);
            
            // Adds a pending message to the state with an initial status of 'sending'
            state.messages.push({
                ...action.payload, // Contains message data such as tempId, sender, recipient, content
                status: 'sending', // Message is pending
            });
        },
        updateMessageStatus(state, action) {
            const { tempId, newStatus } = action.payload;
            const message = state.messages.find((msg) => msg.tempId === tempId);
            if (message) {
                message.status = newStatus; // Updates the message status (e.g., 'sent', 'failed')
            }
        },
        addMessage(state, action) {
            // Adds a fully sent or received message to the messages array
            state.messages.push({
                ...action.payload, // Contains sender, content, and other message details
                status: 'received', // Marks the message as received (you can change this to 'sent' based on context)
            });
        },
    },
});

// Exporting actions for use in components
export const { setMessages, clearMessages, addPendingMessage, updateMessageStatus, addMessage } = messagesSlice.actions;

export default messagesSlice.reducer;