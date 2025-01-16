import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SelfMsg from './SelfMsg';
import OtherMsg from './OtherMsg';
import { setOpenChat } from '../../redux/openChatSlice';
import { selectMessagesByChatId } from '../../redux/chatsSlice';

const MessageSection = React.memo(({ receiver }) => {
    const dispatch = useDispatch();

    const currentUser = useSelector((state) => state.user.user);
    const openChat = useSelector((state) => state.openChat.chat);

    // Select messages for the open chat using the custom selector
    const messages = useSelector((state) => selectMessagesByChatId(state, openChat?._id));

    const messageEndRef = useRef(null);

    const scrollToBottom = () => {
        setTimeout(() => {
            messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    useEffect(() => {
        const savedChat = JSON.parse(sessionStorage.getItem('openChat'));
        if (!openChat && savedChat) {
            dispatch(setOpenChat(savedChat));
        }
    }, [dispatch, openChat]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    if (!messages || messages.length === 0) {
        return <div className="msg-section">No messages to display</div>;
    }

    return (
        <div className="msg-section">
            {messages.map((msg) => {
                const isSelf = msg.sender === currentUser._id;

                return isSelf ? (
                    <SelfMsg
                        key={msg.timestamp}
                        message={msg.content}
                        file={msg.file}
                        timeSent={new Date(msg.timestamp).toLocaleTimeString()}
                        status={msg.seen ? 'seen' : 'delivered'}
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
