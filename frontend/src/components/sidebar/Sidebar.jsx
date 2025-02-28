import React from 'react';
import './sidebar.css'
import UserInfo from './UserInfo';
import ChatList from './chatList/ChatList';
function Sidebar() {
    return (
        <div className='sidebar'>
            <UserInfo />
            <ChatList />
        </div>
    )
}
export default Sidebar;