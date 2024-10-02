import React, { useEffect, useRef } from "react";
import SelfMsg from "./SelfMsg";
import OtherMsg from "./OtherMsg";
import { useSelector, useDispatch } from 'react-redux';
import { setMessages, clearMessages } from '../../redux/messagesSlice';
import { setOpenChat } from '../../redux/openChatSlice';

function MessageSection({ receiver }) {
    const dispatch = useDispatch();
    const openChat = useSelector((state) => state.openChat.chat);
    const currentUser = useSelector((state) => state.user.user);
    const messages = useSelector((state) => state.messages.messages);
    const messageEndRef = useRef(null);

    const scrollToBottom = () => {
        setTimeout(() => {
            messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    useEffect(() => {
        const savedChat = JSON.parse(sessionStorage.getItem('openChat'));
        if (!openChat && savedChat) {
            dispatch(setOpenChat(savedChat));
        }
    }, [dispatch, openChat]);

    useEffect(() => {
        if (openChat && openChat.messages) {
            dispatch(setMessages(openChat.messages));
        } else {
            const fetchMessages = async () => {
                if (openChat?._id) {
                    try {
                        const response = await fetch(`http://localhost:5000/chat/${openChat._id}/messages`, {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem('ringoToken')}`,
                            },
                        });
                        const data = await response.json();
                        dispatch(setMessages(data));
                    } catch (error) {
                        console.error('Error fetching messages:', error);
                    }
                }
            };

            if (openChat) {
                fetchMessages();
            }
        }

        return () => {
            dispatch(clearMessages());
        };
    }, [dispatch, openChat]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    if (!messages || messages.length === 0) {
        return <div className="msg-section">No messages to display</div>;
    }
    console.log(messages);
    
    return (
        <div className="msg-section">
            {messages.map((msg, index) => {
                const isSelf = msg.sender === currentUser._id;

                // Extract file information if it exists
                const file = msg?.file || null;
                // console.log(msg);
                
                return isSelf ? (
                    <SelfMsg
                        key={index}
                        message={msg.content}
                        file={msg.file} // Pass the full file object here
                        timeSent={new Date(msg.timestamp).toLocaleTimeString()}
                        status={msg.seen ? 'seen' : 'delivered'} // Status based on whether the message has been seen
                    />
                ) : (
                    <OtherMsg
                        key={index}
                        senderName={receiver.username}
                        message={msg.content}
                        file={file}
                        timeSent={new Date(msg.timestamp).toLocaleTimeString()}
                    />
                );
            })}

            <div ref={messageEndRef} />
        </div>
    );
}

export default MessageSection;
