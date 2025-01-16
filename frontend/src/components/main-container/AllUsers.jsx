import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './all-users.css';
import AddUserItem from './AddUserItem';
import LinearProgress from '@mui/material/LinearProgress';
import { useNavigate } from 'react-router-dom';
import { clearOpenChat, setOpenChat } from '../../redux/openChatSlice';
import { addChat } from '../../redux/chatsSlice';

function AllUsers() {
    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);
    const chats = useSelector((state) => state.chats.chats);
    const openChat = useSelector((state) => state.openChat);
    const navigate = useNavigate();
    const isTemporaryChatRef = useRef(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:5000/user/getAllUsers');
                const data = await response.json();
                setUsers(data);
                setFilteredUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = users.filter(user => user.username.toLowerCase().includes(query));
        setFilteredUsers(filtered);
    };

    const deleteTemporaryChat = async (chatId) => {
        try {
            await fetch(`http://localhost:5000/chat/discard/${chatId}/${user._id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });
        } catch (error) {
            console.error('Error discarding temporary chat:', error);
        }
    };

    const handleMessage = async (recipientId) => {
        console.log("User Chats in All users Section",chats);
        
        const existingChat = chats.find(chat => chat.participants.includes(recipientId));

        if (existingChat) {
            dispatch(setOpenChat({ chat: existingChat, temporary: false }));
            navigate(`/chat/${existingChat._id}`, { replace: true });
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/chat/checkOrCreate/${user._id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ recipient_id: recipientId }),
            });

            const { chat } = await response.json();

            dispatch(addChat(chat));
            dispatch(setOpenChat({ chat, temporary: false }));
            navigate(`/chat/${chat._id}`, { replace: true });
        } catch (error) {
            console.error('Error initiating chat:', error);
        }
    };

    useEffect(() => {
        const temporaryChatId = localStorage.getItem('temporaryChatId');
        if (temporaryChatId) {
            if (openChat && openChat.chatId === temporaryChatId && !openChat.messages.length) {
                deleteTemporaryChat(temporaryChatId);
                dispatch(clearOpenChat());
                localStorage.removeItem('temporaryChatId');
            }
        }
    }, [openChat, dispatch]);

    return (
        <div className='all-users-side'>
            <input
                type='text'
                placeholder='Search for a username'
                value={searchQuery}
                onChange={handleSearch}
                className='search-bar'
            />
            <div className='user-list'>
                <div className='loading-bar-users'>
                    {loading && (
                        <LinearProgress
                            sx={{
                                height: '3px',
                                width: '100%',
                                left: 0,
                                '& .MuiLinearProgress-bar': {
                                    backgroundColor: '#ff0000',
                                },
                                backgroundColor: '#cccccc',
                            }}
                        />
                    )}
                </div>
                {filteredUsers.map(user => (
                    <AddUserItem
                        key={user._id}
                        user={user}
                        handleMessage={handleMessage}
                    />
                ))}
            </div>
        </div>
    );
}

export default AllUsers;