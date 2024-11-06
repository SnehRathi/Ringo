const Message = require('../models/msg');
const Chat = require('../models/chat');
const User = require('../models/user');
const File = require('../models/file'); // Import the File schema

// Controller to handle updating the last message and unread count
const updateLastMessage = async (senderId, recipientId, chatId, lastMessageId) => {
    const currentDate = new Date();

    try {
        // Update the last message field in the Chat document
        await Chat.updateOne(
            { _id: chatId },
            { $set: { lastMessage: lastMessageId } }
        );

        // Update sender's chat list with last message and date
        await User.updateOne(
            { _id: senderId, "chats.chatId": chatId },
            { $set: { "chats.$.lastMessage": lastMessageId, "chats.$.lastMessageDate": currentDate } }
        );

        // Update recipient's chat list with last message, date, and increment unread count
        await User.updateOne(
            { _id: recipientId, "chats.chatId": chatId },
            {
                $set: { "chats.$.lastMessage": lastMessageId, "chats.$.lastMessageDate": currentDate },
                $inc: { "chats.$.unreadCount": 1 }
            }
        );

        console.log('Last message and unread count updated');
    } catch (error) {
        console.error('Error updating last message:', error);
        throw new Error('Could not update last message');
    }
};

// Main controller to handle sending both text and file messages
const sendMessage = async ({ senderId, chatId, content, file, isTemporary, io }) => {
    if (!content && !file) {
        throw new Error('Message content or file is required');
    }

    try {
        // Find the chat by chatId and populate participants
        const chat = await Chat.findById(chatId).populate('participants');
        if (!chat) throw new Error('Chat not found');

        // Get the receiver (participant that is not the sender)
        const receiver = chat.participants.find(p => p._id.toString() !== senderId);
        if (!receiver) throw new Error('Receiver not found');

        let fileData = null;

        // If there's a file, save it
        if (file) {
            fileData = new File({
                fileUrl: file.fileUrl,
                fileType: file.fileType,
                fileMimeType: file.fileMimeType,
            });
            await fileData.save();
        }

        // Prepare the message data
        const messageData = {
            sender: senderId,
            content: content || '',
            file: fileData ? fileData._id : null, // Reference the file if present
            chat: chatId,
        };

        // Emit message to receiver immediately
        io.to(receiver._id.toString()).emit('receiveMessage', {
            ...messageData,
            timestamp: new Date(),
            seenBy: [],
        });

        console.log("Message Emitted");
        
        // Save the message in the database
        const message = new Message(messageData);
        await message.save();

        // Update the chat's messages array and save the chat
        chat.messages.push(message._id);
        await chat.save();

        // Update last message and unread count for both sender and receiver
        await updateLastMessage(senderId, receiver._id.toString(), chatId, message._id);

        console.log('Message saved to database');
        return message;
    } catch (error) {
        console.error('Error sending message:', error);
        throw new Error('Failed to send message');
    }
};

module.exports = {
    sendMessage,
};