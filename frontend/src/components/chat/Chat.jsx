import React, { useState, useEffect } from 'react';
import './chat.css';
import './messages.css';
import { ReactComponent as Mic } from '../../svgs/mic.svg';
import { ReactComponent as Phone } from '../../svgs/phone.svg';
import { ReactComponent as Emoji } from '../../svgs/emoji.svg';
import { ReactComponent as File } from '../../svgs/file.svg';
import { ReactComponent as Info } from '../../svgs/info.svg';
import { ReactComponent as Videocam } from '../../svgs/videocam.svg';
import { useDispatch, useSelector } from 'react-redux';
import { clearNewChat } from '../../redux/newChatSlice';
import { addPendingMessage, updateMessageStatus, addMessage } from '../../redux/messagesSlice'; // Add addMessage action for real-time
import MessageSection from './MessageSection';
import { v4 as uuidv4 } from 'uuid'; // For generating a temporary unique ID
import { io } from 'socket.io-client'; // Import the Socket.IO client

const socket = io('http://localhost:5000'); // Initialize Socket.IO connection

function Chat() {
    const dispatch = useDispatch();
    const openChat = useSelector(state => state.openChat.chat); // The opened chat
    const isTemporary = useSelector(state => state.openChat.temporary);
    const currentUser = useSelector(state => state.user.user); // Current user info

    // Find the recipient by excluding the logged-in user from participants
    const receiver = openChat && openChat.participants
        ? openChat.participants.find(p => p._id !== currentUser._id)
        : null;

    const [message, setMessage] = useState(""); // State to store the input message

    // Connect to Socket.IO and join the chat room
    useEffect(() => {
        
        if (currentUser) {
            socket.on('connect', () => {
                console.log('Connect to Socket.IO server with ID:', socket.id);
            });
            socket.emit('joinRoom', currentUser._id); // Join the room with the user ID


            socket.on('receiveMessage', (msg) => {
                console.log('Message received:', msg);
                dispatch(addMessage({
                    sender: msg.senderId,
                    content: msg.content,
                    timestamp: msg.timestamp,
                }));
            });
        }

        return () => {
            socket.off('receiveMessage');
        };
    }, [dispatch, currentUser]);

    const handleMessageChange = (e) => {
        setMessage(e.target.value);
    };

    const sendMessage = () => {
        if (!message.trim()) return;

        const tempId = uuidv4();
        dispatch(addPendingMessage({
            tempId,
            sender: currentUser._id,
            recipient: receiver._id,
            content: message,
            timestamp: new Date().toISOString(),
        }));

        socket.emit('sendMessage', {
            senderId: currentUser._id,
            recipientId: receiver._id,
            content: message,
            isTemporary: isTemporary,
        });

        setMessage(""); // Clear input field

        if (isTemporary) {
            dispatch(clearNewChat());
        }
    };


    if (!openChat || !receiver) {
        return <></>; // Render nothing if no chat or receiver
    }

    return (
        <div className='chat'>
            {/* Chat header */}
            <div className='chat-header-container'>
                <div className='chat-header'>
                    <img src={receiver.profilePicture} alt="Profile Picture" />
                    <div className='username-about-icons'>
                        <div className='username-about'>
                            <span className='username'>{receiver.username}</span>
                            <p className='about'>Living the life my way</p>
                        </div>
                        <div className='icons'>
                            <div className='icon-container'>
                                <Phone className="icon" />
                            </div>
                            <div className='icon-container'>
                                <Videocam className="icon" />
                            </div>
                            <div className='icon-container'>
                                <Info className="icon" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages section */}
            <MessageSection sender={receiver} />

            {/* Chat options */}
            <div className="chat-options">
                <div className="left-icons">
                    <button className="icon-btn">
                        <Emoji className="icon" />
                    </button>

                    <button className="icon-btn">
                        <input type="file" className="file-input" />
                        <label htmlFor="file-upload" className='file-upload-label'>
                            <File className="icon" />
                        </label>
                    </button>
                </div>

                {/* Input for typing a message */}
                <input
                    type="text"
                    className="message-input"
                    placeholder="Type a message..."
                    value={message}
                    onChange={handleMessageChange}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()} // Send message on Enter key press
                />

                <div className="right-icons">
                    <button className="icon-btn">
                        <Mic className="icon" />
                    </button>

                    {/* Send button */}
                    <button className="send-btn" onClick={sendMessage}>
                        <img src="/send-icon.png" alt="Send" className="icon" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Chat;
