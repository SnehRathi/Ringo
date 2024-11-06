const Chat = require('../models/chat'); // Import the Chat model
const User = require('../models/user'); // Import the User model
const Message = require('../models/msg'); // Import the Msg model

// Create a chat or return the existing one
const createTemporaryChat = async (req, res) => {
    const recipientId = req.body.recipient_id;
    const senderId = req.params.send_id;

    try {
        // Check if a chat already exists between the sender and recipient
        let chat = await Chat.findOne({
            participants: { $all: [senderId, recipientId] },
            isGroupChat: false,
        });

        if (chat) {
            // Fetch user data for both participants
            const sender = await User.findById(senderId).select('username profilePicture');
            const recipient = await User.findById(recipientId).select('username profilePicture');

            return res.status(200).json({
                chat: {
                    ...chat.toObject(),
                    participants: [sender, recipient],
                },
                isTemporary: false,  // Existing chat in DB
                message: 'Existing chat found',
            });
        }

        // Create a new chat instance
        const newChat = new Chat({
            participants: [senderId, recipientId],
            isGroupChat: false,
            messages: [], // No messages initially
        });

        // Save the new chat to the database
        await newChat.save();

        // Add chat reference to both users' chat lists
        await User.findByIdAndUpdate(senderId, {
            $push: { chats: { chatId: newChat._id } }
        });

        await User.findByIdAndUpdate(recipientId, {
            $push: { chats: { chatId: newChat._id } }
        });

        // Fetch user data for both participants
        const sender = await User.findById(senderId).select('username profilePicture');
        const recipient = await User.findById(recipientId).select('username profilePicture');

        return res.status(201).json({
            chat: {
                ...newChat.toObject(),
                participants: [sender, recipient],
            },
            isTemporary: true, // Chat is created but no messages are sent yet
            message: 'New temporary chat created',
        });
    } catch (error) {
        console.error('Error creating temporary chat:', error);
        res.status(500).json({ message: 'Error creating temporary chat' });
    }
};

// Discard a temporary chat if no message has been sent
const discardTemporaryChat = async (req, res) => {
    const chatId = req.params.chatId;
    const senderId = req.params.senderId;

    try {
        // Check if the chat exists and has no messages
        const chat = await Chat.findById(chatId).populate('messages');

        if (chat && chat.messages.length === 0) {
            // Remove chat from both users' chat lists
            await User.updateOne(
                { _id: senderId },
                { $pull: { chats: { chatId } } }
            );

            await User.updateOne(
                { _id: chat.participants.find(id => id !== senderId) },
                { $pull: { chats: { chatId } } }
            );

            // Delete the chat from the Chat collection
            await Chat.findByIdAndDelete(chatId);

            return res.status(200).json({ message: 'Temporary chat discarded' });
        } else {
            return res.status(400).json({ message: 'Chat cannot be discarded, it contains messages' });
        }
    } catch (error) {
        console.error('Error discarding temporary chat:', error);
        res.status(500).json({ message: 'Error discarding temporary chat' });
    }
};

// Get all user chats
const getUserChats = async (req, res) => {
    const userId = req.user._id;

    try {
        // Step 1: Get the user's chat list with unread counts
        const user = await User.findById(userId).select('chats');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const chatIds = user.chats.map(chat => chat.chatId);

        // Step 2: Fetch the chat details for the user's chats
        const chats = await Chat.find({ _id: { $in: chatIds } })
            .populate('participants', 'username profilePicture status')
            .populate({
                path: 'messages',
                populate: {
                    path: 'file',
                    select: 'fileUrl fileType fileMimeType isDownloaded timestamp',
                },
            })
            .populate('lastMessage', 'content sender createdAt')
            .exec();

        // Step 3: Combine chats with unread counts
        const combinedChats = chats.map(chat => {
            const unreadCountEntry = user.chats.find(c => c.chatId.toString() === chat._id.toString());
            return {
                ...chat.toObject(),
                unreadCount: unreadCountEntry ? unreadCountEntry.unreadCount : 0,
            };
        });
        
        // console.log(combinedChats);
        res.json(combinedChats);
    } catch (error) {
        console.error('Error fetching user chats:', error);
        res.status(500).json({ message: 'Error fetching user chats' });
    }
};


module.exports = {
    createTemporaryChat,
    discardTemporaryChat,
    getUserChats
};
