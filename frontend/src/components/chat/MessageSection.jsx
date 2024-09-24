import React, { useEffect, useRef } from "react";
import SelfMsg from "./SelfMsg";
import OtherMsg from "./OtherMsg";
import { useSelector, useDispatch } from 'react-redux';
import { setMessages, clearMessages } from '../../redux/messagesSlice'; // Import the actions from the messages slice

function MessageSection({sender}) {
    const dispatch = useDispatch();
    const openChat = useSelector((state) => state.openChat.chat); // Get the current open chat from Redux
    const currentUser = useSelector((state) => state.user.user); // Get the current user info from Redux
    const messages = useSelector((state) => state.messages.messages); // Get the messages from the messages slice
    const messageEndRef = useRef(null); // Ref to scroll to the bottom of the messages

    // Function to scroll to the bottom
    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        // If the openChat already contains messages, use them without fetching again
        if (openChat && openChat.messages) {
            dispatch(setMessages(openChat.messages));
        } else {
            // Fetch the messages only if not already present
            const fetchMessages = async () => {
                if (openChat?._id) {
                    try {
                        const response = await fetch(`http://localhost:5000/chat/${openChat._id}/messages`, {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem('ringoToken')}`,
                            },
                        });
                        const data = await response.json();
                        dispatch(setMessages(data)); // Set the messages in Redux
                    } catch (error) {
                        console.error('Error fetching messages:', error);
                    }
                }
            };

            if (openChat) {
                fetchMessages();
            }
        }

        // Clear messages when switching to another chat
        return () => {
            dispatch(clearMessages());
        };
    }, [dispatch, openChat]);

    useEffect(() => {
        // Scroll to the bottom when messages array changes
        scrollToBottom();
    }, [messages]);

    if (!messages || messages.length === 0) {
        return <div className="msg-section">No messages to display</div>;
    }
    
    return (
        <div className="msg-section">
            {messages.map((msg, index) => {
                const isSelf = msg.sender === currentUser._id; // Check if the current user sent the message
                // console.log(msg);
                
                return isSelf ? (
                    <SelfMsg
                        key={index}
                        message={msg.content}
                        timeSent={new Date(msg.timestamp).toLocaleTimeString()}
                        status={msg.seen ? 'seen' : 'delivered'} // Assuming 'seen' or 'delivered' status
                    />
                ) : (
                    <OtherMsg
                        key={index}
                        profilePhoto={sender.profilePicture} // Sender's profile picture
                        senderName={sender.username} // Sender's username
                        message={msg.content}
                        timeSent={new Date(msg.timestamp).toLocaleTimeString()}
                    />
                );
            })}

            {/* Empty div to scroll to */}
            <div ref={messageEndRef} />
        </div>
    );
}

export default MessageSection;