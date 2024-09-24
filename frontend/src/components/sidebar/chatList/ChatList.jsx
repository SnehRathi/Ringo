import React, { useState, useEffect } from "react";
import "./chatList.css";
import Conversation from "./Conversation";
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenChat } from '../../../redux/openChatSlice';

const ChatList = () => {
    const [chats, setChats] = useState([]);
    const newChat = useSelector((state) => state.newChat); // Get the temporary new chat from Redux
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const response = await fetch('http://localhost:5000/chat/getUserChats', {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('ringoToken')}` }
                });
                const data = await response.json();
                // console.log(data);
                setChats(data);
            } catch (error) {
                console.error('Error fetching chats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchChats();
    }, []);

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

            {/* Loading indicator */}
            {loading && <div>Loading...</div>}

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
                        onClick={() => handleOpenChat(chat)} // Pass the full chat object
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
