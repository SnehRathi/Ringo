import React from "react";
import './conversation.css';

function Conversation({ chat }) {
    return (
        <div className="conversation">
            <img src={chat.avatar} alt="user-profile" />
            <div className="username-lastmsg">
                <div className="username-time">
                    <span className="username">{chat.username}</span>
                    <span className="last-msg-time">{chat.time}</span>
                </div>
                <p className="last-msg">{chat.lastMessage}</p>
            </div>
        </div>
    );
}

export default Conversation;
