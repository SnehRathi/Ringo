import React from "react";
import "./chatList.css";
import Conversation from "./Conversation";
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenChat } from '../../../redux/openChatSlice';

const ChatList = () => {
    const chats = useSelector((state) => state.chats.chats); // Fetch chats from Redux
    const newChat = useSelector((state) => state.newChat);
    const dispatch = useDispatch();

    const handleOpenChat = (chat) => {
        dispatch(setOpenChat({ chat, temporary: false }));
    };

    return (
        <div className="chat-list">
            {/* Search bar */}
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
                {/* Display the temporary chat */}
                {newChat && (
                    <Link
                        to={`/chat/${newChat._id}`}
                        className="conversation-link"
                        onClick={() => handleOpenChat(newChat)}
                    >
                        <Conversation
                            chat={newChat._id}
                            participants={newChat.participants}
                            lastMessage={newChat.lastMessage}
                        />
                    </Link>
                )}

                {/* Display existing chats */}
                {chats.map((chat, index) => (
                    <Link
                        key={index}
                        to={`/chat/${chat._id}`}
                        className="conversation-link"
                        onClick={() => handleOpenChat(chat)} 
                    >
                        <Conversation
                            key={chat._id}
                            chat={chat._id}
                            participants={chat.participants}
                            lastMessage={chat.lastMessage}
                        />
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default ChatList;