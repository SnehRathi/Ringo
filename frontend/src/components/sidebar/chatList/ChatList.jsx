import React, { useState, useEffect } from "react";
import "./chatList.css";
import Conversation from "./Conversation";
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenChat } from '../../../redux/openChatSlice';
import Skeleton from 'react-loading-skeleton'; 
import 'react-loading-skeleton/dist/skeleton.css'; 

const ChatList = () => {
    const chats = useSelector((state) => state.chats.chats); // Fetch chats from Redux
    const newChat = useSelector((state) => state.newChat);
    const openChat = useSelector((state) => state.openChat.chat); // Get currently open chat
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        if (chats.length > 0) {
            setLoading(false); 
        }
    }, [chats]);

    const handleOpenChat = (chat) => {
        dispatch(setOpenChat({ chat, temporary: false }));
    };

    return (
        <div className="chat-list">
            <div className="search-bar">
                <label htmlFor="user-search-bar"><img src="/search.png" alt="Search icon" /></label>
                <input
                    type="text"
                    id="user-search-bar"
                    name="searched-user"
                    placeholder="Search..."
                    autoComplete="off"
                />
            </div>

            <div className="conversations">
                {loading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                        <div className="skeleton-conversation" key={index}>
                            <Skeleton circle={true} height={50} width={50} />
                            <div className="skeleton-text">
                                <Skeleton height={20} width={`60%`} />
                                <Skeleton height={15} width={`80%`} />
                            </div>
                        </div>
                    ))
                ) : (
                    <>
                        {/* Display the temporary chat */}
                        {newChat && (
                            <Link
                                to={`/chat/${newChat._id}`}
                                className={`conversation-link`}
                                onClick={() => handleOpenChat(newChat)}
                            >
                                <Conversation
                                    chat={newChat._id}
                                    participants={newChat.participants}
                                />
                            </Link>
                        )}

                        {/* Display existing chats */}
                        {chats.map((chat, index) => {
                            // console.log(chat);
                            return (
                                <Link
                                    key={index}
                                    to={`/chat/${chat._id}`}
                                    className={`conversation-link`}
                                    onClick={() => handleOpenChat(chat)}
                                >
                                    <Conversation
                                        key={chat._id}
                                        chat={chat._id}
                                        participants={chat.participants}
                                        lastMessage={chat.lastMessage ? chat.lastMessage.content : null}
                                        unreadCount={chat.unreadCount}
                                        lastMessageDate={chat.lastMessage ? chat.lastMessage.createdAt : null}
                                        isChatOpen = {openChat && openChat._id === chat._id}
                                    />
                                </Link>
                            );
                        })}
                    </>
                )}
            </div>
        </div>
    );
};

export default ChatList;