import React from "react";
import { useLocation } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar';
import Chat from '../chat/Chat';
import WelcomePage from "../welcome-page/WelcomePage";
import './main-container.css';

function MainContainer({isChatOpen}) {
    const location = useLocation();
    // const isChatPage = location.pathname.startsWith("/chat");

    return (
        <div className='main-container'>
            <Sidebar />
            {isChatOpen ? <Chat /> : <WelcomePage />}
        </div>
    );
}

export default MainContainer;
