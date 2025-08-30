const Message = require('../models/msg');
const Chat = require('../models/chat');
const User = require('../models/user');
const File = require('../models/file'); // Import the File schema

// Updated controller to handle last message and unread count for both sender and receiver
const updateLastMessage = async (senderId, recipientId, chatId, lastMessageId) => {
    const currentDate = new Date();

    try {
        // Update last message in the Chat document
        await Chat.updateOne(
            { _id: chatId },
            { $set: { lastMessage: lastMessageId } }
        );

        // Update sender's chat list with last message and date (without unread count)
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
        // console.log('Last message and unread count updated');
    } catch (error) {
        console.error('Error updating last message:', error);
        throw new Error('Could not update last message');
    }
};

// Main controller to handle sending both text and file messages
const sendMessage = async ({ senderId, chatId, content, file, isTemporary, io }) => {
    if (!content && !file) throw new Error('Message content or file is required');

    try {
        const chat = await Chat.findById(chatId).populate('participants');
        if (!chat) throw new Error('Chat not found');

        const receiver = chat.participants.find((p) => p._id.toString() !== senderId);
        if (!receiver) throw new Error('Receiver not found');
        // console.log(receiver);
        let fileData = null;
        if (file) {
            fileData = new File({
                fileUrl: file.fileUrl,
                fileType: file.fileType,
                fileMimeType: file.fileMimeType,
            });
            await fileData.save();
        }

        const messageData = {
            sender: senderId,
            content: content || '',
            file: fileData ? fileData._id : null,
            chat: chatId,
            timestamp: new Date(),
        };

        const message = new Message(messageData);
        await message.save();

        chat.messages.push(message._id);
        await chat.save();

        // Update the last message in the chat and users' chat lists
        await updateLastMessage(senderId, receiver._id, chatId, message._id); // This is the key change

        // console.log("Emitting the message to the room in sendMessage Controller ",chatId);
        io.to(chatId).emit('receiveMessage', {
            ...messageData,
            seenBy: [],
        });
        return message;
    } catch (error) {
        console.error('Error sending message:', error);
        throw new Error('Failed to send message');
    }
};


module.exports = {
    sendMessage,
};