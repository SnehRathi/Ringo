import React, { useEffect, useRef } from "react";
import SelfMsg from "./SelfMsg";
import OtherMsg from "./OtherMsg";
import { useSelector, useDispatch } from 'react-redux';
import { setOpenChat } from '../../redux/openChatSlice';

const MessageSection = React.memo(({ receiver }) => {
    const dispatch = useDispatch();
    const openChat = useSelector((state) => state.openChat.chat);
    const currentUser = useSelector((state) => state.user.user);
    const messages = useSelector((state) => state.openChat.chat?.messages); // Safely access messages
    // console.log('Messages in openChat:', messages);

    const messageEndRef = useRef(null);

    const scrollToBottom = () => {
        setTimeout(() => {
            messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    // Load the chat from sessionStorage if it exists but not in Redux
    useEffect(() => {
        const savedChat = JSON.parse(sessionStorage.getItem('openChat'));
        if (!openChat && savedChat) {
            dispatch(setOpenChat(savedChat));
        }
    }, [dispatch, openChat]);

    // Scroll to the bottom whenever messages update
    useEffect(() => {
        scrollToBottom();
    }, [messages]); // Scrolls when messages are updated

    if (!messages || messages.length === 0) {
        return <div className="msg-section">No messages to display</div>;
    }

    return (
        <div className="msg-section">
            {messages.map((msg) => {
                const isSelf = msg.sender === currentUser._id;
                // console.log(msg);
                
                return isSelf ? (
                    <SelfMsg
                        key={msg.timestamp}
                        message={msg.content}
                        file={msg.file} // Pass the full file object here
                        timeSent={new Date(msg.timestamp).toLocaleTimeString()}
                        status={msg.seen ? 'seen' : 'delivered'} // Status based on whether the message has been seen
                    />
                ) : (
                    <OtherMsg
                        key={msg.timestamp}
                        senderName={receiver.username}
                        message={msg.content}
                        file={msg.file || null}
                        timeSent={new Date(msg.timestamp).toLocaleTimeString()}
                    />
                );
            })}

            <div ref={messageEndRef} />
        </div>
    );
});

export default MessageSection;
