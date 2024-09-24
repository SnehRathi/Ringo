const Message = require('../models/msg');
const Chat = require('../models/chat'); // Assuming you have a Chat model
const User = require('../models/user');

// Controller to handle sending a message
const saveChatToUsers = async (senderId, recipientId, chatId, lastMessage) => {
    const currentDate = new Date();

    try {
        // Add the chat to the sender's chat list with unreadCount set to 0
        await User.updateOne(
            { _id: senderId },
            { $push: { chats: { chatId, lastMessage, lastMessageDate: currentDate, unreadCount: 0 } } }
        );

        // Add the chat to the recipient's chat list with unreadCount set to 1
        await User.updateOne(
            { _id: recipientId },
            { $push: { chats: { chatId, lastMessage, lastMessageDate: currentDate, unreadCount: 1 } } }
        );

        console.log('Chat saved in both users chat lists');
    } catch (error) {
        console.error('Error saving chat to users:', error);
        throw new Error('Could not save chat to users');
    }
};

const updateLastMessage = async (senderId, recipientId, chatId, lastMessage) => {
    const currentDate = new Date();

    try {
        // Update the sender's chat list with the last message and date
        await User.updateOne(
            { _id: senderId, "chats.chatId": chatId },
            { $set: { "chats.$.lastMessage": lastMessage, "chats.$.lastMessageDate": currentDate } }
        );

        // Update the recipient's chat list with the last message, date, and increment unread count
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

const sendMessage = async ({ sender, recipientId, content, isTemporary, io }) => {
    if (!content) {
        throw new Error('Message content cannot be empty');
    }

    try {
        // Find the chat in the database
        let chat = await Chat.findOne({
            participants: { $all: [sender, recipientId], $size: 2 },
            isGroupChat: false
        });

        // Create the chat if it doesn't exist and isTemporary is true
        if (!chat && isTemporary) {
            chat = new Chat({
                participants: [sender, recipientId],
                isGroupChat: false,
                messages: [],
            });
            await chat.save();
        }

        if (!chat) {
            throw new Error('Chat not found');
        }

        // Create and save the new message
        const message = new Message({ sender, recipient: recipientId, content });
        await message.save();

        // Add the new message to the chat's messages array
        chat.messages.push(message._id);
        await chat.save();

        // Handle chat in users' list depending on temporary status
        if (isTemporary) {
            await saveChatToUsers(sender, recipientId, chat._id, content);
        } else {
            await updateLastMessage(sender, recipientId, chat._id, content);
        }

        // Emit the message to the recipient's room via Socket.IO
        if (io) {
            io.to(recipientId).emit('receiveMessage', {
                senderId: sender,
                content,
                timestamp: new Date().toISOString(),
            });
        }

        return message;
    } catch (error) {
        console.error('Error sending message:', error);
        throw new Error('Failed to send message');
    }
};


// getMessagesBetweenUsers,
module.exports = {
    sendMessage
};
