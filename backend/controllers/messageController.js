const Message = require('../models/msg');
const Chat = require('../models/chat');
const User = require('../models/user');
const File = require('../models/file'); // Import the File schema

// Controller to handle saving chat between users
const saveChatToUsers = async (senderId, recipientId, chatId, lastMessage) => {
    const currentDate = new Date();

    try {
        // Add chat to sender's chat list with unreadCount set to 0
        await User.updateOne(
            { _id: senderId },
            { $push: { chats: { chatId, lastMessage, lastMessageDate: currentDate, unreadCount: 0 } } }
        );

        // Add chat to recipient's chat list with unreadCount set to 1
        await User.updateOne(
            { _id: recipientId },
            { $push: { chats: { chatId, lastMessage, lastMessageDate: currentDate, unreadCount: 1 } } }
        );

        console.log('Chat saved to both users chat lists');
    } catch (error) {
        console.error('Error saving chat to users:', error);
        throw new Error('Could not save chat to users');
    }
};

// Controller to handle updating the last message and unread count
const updateLastMessage = async (senderId, recipientId, chatId, lastMessage) => {
    const currentDate = new Date();

    try {
        // Update sender's chat list with last message and date
        await User.updateOne(
            { _id: senderId, "chats.chatId": chatId },
            { $set: { "chats.$.lastMessage": lastMessage, "chats.$.lastMessageDate": currentDate } }
        );

        // Update recipient's chat list with last message, date, and increment unread count
        await User.updateOne(
            { _id: recipientId, "chats.chatId": chatId },
            {
                $set: { "chats.$.lastMessage": lastMessage, "chats.$.lastMessageDate": currentDate },
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
const sendMessage = async ({ senderId, recipientId, content, file, isTemporary, io }) => {
    if (!content && !file) {
        throw new Error('Message content or file is required');
    }

    try {
        // Find chat between users
        let chat = await Chat.findOne({
            participants: { $all: [senderId, recipientId], $size: 2 },
            isGroupChat: false
        });

        // If chat doesn't exist, create a new chat (if temporary flag is set)
        if (!chat && isTemporary) {
            chat = new Chat({
                participants: [senderId, recipientId],
                isGroupChat: false,
                messages: []
            });
            await chat.save();
        }

        if (!chat) {
            throw new Error('Chat not found');
        }

        let fileId = null;

        // If there's a file in the message, save the file information
        if (file) {
            const fileData = new File({
                fileUrl: file.fileUrl,      // URL of the file
                fileType: file.fileType,    // File type (image, video, etc.)
                fileMimeType: file.fileMimeType // MIME type of the file
            });
            await fileData.save();
            fileId = fileData._id; // Save file ID to reference in the message
        }

        // Prepare the message data
        const messageData = {
            sender: senderId,
            recipient: recipientId,
            content: content || '', // Optional text content
            file: fileId ? fileId : null // Reference the file if present
        };

        // Create and save the message
        const message = new Message(messageData);
        await message.save();

        // Add the new message to the chat's messages array
        chat.messages.push(message._id);
        await chat.save();

        // Save or update chat in users' list depending on temporary status
        if (isTemporary) {
            await saveChatToUsers(senderId, recipientId, chat._id, content || `File: ${file.fileType}`);
        } else {
            await updateLastMessage(senderId, recipientId, chat._id, content || `File: ${file.fileType}`);
        }

        // Emit the message to the recipient's room via Socket.IO
        if (io) {
            io.to(recipientId).emit('receiveMessage', {
                senderId: senderId,
                content: content || null,
                fileUrl: file?.fileUrl || null,
                fileType: file?.fileType || null,
                fileMimeType: file?.fileMimeType || null,
                timestamp: new Date().toISOString(),
            });
        }

        return message;
    } catch (error) {
        console.error('Error sending message:', error);
        throw new Error('Failed to send message');
    }
};

module.exports = {
    sendMessage,
};