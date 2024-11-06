import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './all-users.css';
import AddUserItem from './AddUserItem';
import LinearProgress from '@mui/material/LinearProgress';
import { useNavigate } from 'react-router-dom';
import { clearOpenChat, setOpenChat } from '../../redux/openChatSlice';
import { setNewChat } from '../../redux/newChatSlice';

function AllUsers() {
    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user); // Fetch user data from Redux
    const openChat = useSelector((state) => state.openChat); // Get the currently opened chat from Redux
    const navigate = useNavigate();
    const isTemporaryChatRef = useRef(false); // Use ref to store if the current chat is temporary

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true); // Show progress bar
                const response = await fetch('http://localhost:5000/user/getAllUsers');
                const data = await response.json();
                setUsers(data);
                setFilteredUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false); // Hide progress bar
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
        // If a temporary chat exists and no message has been sent, delete it
        if (isTemporaryChatRef.current && openChat && !openChat.messages.length) {
            console.log("removing temporary chat");
            
            await deleteTemporaryChat(openChat.chatId); // Use chatId if it's part of openChat
            dispatch(clearOpenChat()); // Clear the current chat from Redux
            localStorage.removeItem('temporaryChatId'); // Remove chat ID from localStorage
        }
        
        try {
            const response = await fetch(`http://localhost:5000/chat/createTemporaryChat/${user._id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ recipient_id: recipientId }),
            });

            const { chat, isTemporary } = await response.json();
            console.log(chat, isTemporary);
            
            if (chat) {
                isTemporaryChatRef.current = isTemporary; // Track if the chat is temporary
                dispatch(setOpenChat({ chat: chat, temporary: isTemporary })); // Set the temporary chat in Redux
                dispatch(setNewChat(chat)); // Optionally set new chat data
                localStorage.setItem('temporaryChatId', chat._id); // Store chat ID in localStorage
                navigate(`/chat/${chat._id}`, { replace: true });
            }
        } catch (error) {
            console.error('Error initiating chat:', error);
        }
    };

    // Effect to check for existing temporary chat on refresh
    useEffect(() => {
        const temporaryChatId = localStorage.getItem('temporaryChatId');
        if (temporaryChatId) {
            // Check if the chat exists in Redux and has no messages
            if (openChat && openChat.chatId === temporaryChatId && !openChat.messages.length) {
                deleteTemporaryChat(temporaryChatId);
                dispatch(clearOpenChat());
                localStorage.removeItem('temporaryChatId'); // Remove chat ID from localStorage
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