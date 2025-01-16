import React from "react";
import { useSelector } from 'react-redux';
import './conversation.css';

function Conversation({ participants, lastMessage, unreadCount, lastMessageDate,isChatOpen }) {
    const loggedInUser = useSelector((state) => state.user.user);

    // Find the recipient by filtering out the logged-in user
    const recipient = participants && participants.length > 1
        ? participants.find(p => p._id !== loggedInUser._id)
        : null;

    // Format the lastMessageDate to a more readable format (e.g., HH:MM or date)
    const formattedDate = lastMessageDate
        ? new Date(lastMessageDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : '';

    return (
        <div className={`conversation ${isChatOpen ? 'active-chat' : ''}`}>
            {recipient && (
                <>
                    <img src={recipient.profilePicture} alt="user-profile" />
                    <div className="username-lastmsg">
                        <div className="username-time">
                            <span className="username">{recipient.username}</span>
                            {/* Display last message time */}
                            <span className="last-msg-time">{formattedDate}</span>
                        </div>
                        {/* Render the last message */}
                        <div className="lastmsg-unread-count">
                            <p className="last-msg">{lastMessage || 'No messages yet'}</p>
                            {/* Display unread message count, only if greater than 0 */}
                            {unreadCount > 0 && (
                                <div className="unread-count">
                                    {unreadCount}
                                </div>
                            )}
                        </div>
                    </div>

                </>
            )}
        </div>
    );
}

export default Conversation;