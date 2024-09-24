import React from "react";
import { useSelector } from 'react-redux'; // Import useSelector to get the logged-in user
import './conversation.css';

function Conversation({ chat, participants, lastMessage }) {
    const loggedInUser = useSelector((state) => state.user.user); // Get the logged-in user from Redux

    // Find the recipient by filtering out the logged-in user
    const recipient = participants && participants.length > 1 
        ? participants.find(p => p._id !== loggedInUser._id) // Exclude the logged-in user
        : null;

    return (
        <div className="conversation">
            {recipient && (
                <>
                    <img src={recipient.profilePicture} alt="user-profile" />
                    <div className="username-lastmsg">
                        <div className="username-time">
                            <span className="username">{recipient.username}</span>
                        </div>
                        <p className="last-msg">{lastMessage || 'No messages yet'}</p>
                    </div>
                </>
            )}
        </div>
    );
}

export default Conversation;
