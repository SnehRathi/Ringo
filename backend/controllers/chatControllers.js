const Chat = require('../models/chat'); // Import the Chat model
const User = require('../models/user'); // Import the User model
const Message = require('../models/msg'); // Import the Msg model

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
            // Fetch user data for both participants to include in the response
            const sender = await User.findById(senderId).select('username profilePicture');
            const recipient = await User.findById(recipientId).select('username profilePicture');

            return res.status(200).json({
                chat: {
                    ...chat.toObject(),
                    participants: [sender, recipient],
                },
                isTemporary: false,  // Chat is already persisted in DB
                message: 'Existing chat found',
            });
        }

        // Don't save the chat yet, just return it as temporary
        const temporaryChat = {
            participants: [senderId, recipientId],
            isGroupChat: false,
            messages: [], // No messages initially
        };

        // Fetch user data for both participants
        const sender = await User.findById(senderId).select('username profilePicture');
        const recipient = await User.findById(recipientId).select('username profilePicture');

        return res.status(201).json({
            chat: {
                ...temporaryChat,
                participants: [sender, recipient],
            },
            isTemporary: true,
            message: 'Temporary chat created, not saved to DB until a message is sent',
        });
    } catch (error) {
        console.error('Error creating temporary chat:', error);
        res.status(500).json({ message: 'Error creating temporary chat' });
    }
};

const discardTemporaryChat = async (req, res) => {
    const chatId = req.params.chatId;
    const senderId = req.params.senderId;

    try {
        // Remove chat from sender's chat array
        await User.updateOne(
            { _id: senderId },
            { $pull: { chats: { chatId } } }
        );

        // Delete the chat from the Chat collection
        await Chat.findByIdAndDelete(chatId);

        res.status(200).json({ message: 'Temporary chat discarded' });
    } catch (error) {
        console.error('Error discarding temporary chat:', error);
        res.status(500).json({ message: 'Error discarding temporary chat' });
    }
};



// Get all user chats
const getUserChats = async (req, res) => {
    const userId = req.user._id;

    try {
        const user = await User.findById(userId).select('chats');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const chatIds = user.chats.map(chat => chat.chatId);

        const chats = await Chat.find({ _id: { $in: chatIds } })
            .populate('participants', 'username profilePicture status')
            .populate('lastMessage', 'content sender createdAt') // Populate last message details
            .populate('messages');
        res.json(chats);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user chats' });
    }
};

module.exports = {
    createTemporaryChat,
    discardTemporaryChat,
    getUserChats
};
