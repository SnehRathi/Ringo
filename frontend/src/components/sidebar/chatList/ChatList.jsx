import React from "react";
import "./chatList.css";
import Conversation from "./Conversation";
import { Link } from 'react-router-dom';

function ChatList() {
    const chats = [
        {
            username: "Sneh Rathi",
            time: "10:30 AM",
            lastMessage: "This was the last message sent.",
            avatar: "/avatar.png"
        },
        {
            username: "John Doe",
            time: "9:45 AM",
            lastMessage: "See you tomorrow!",
            avatar: "/avatar.png"
        },
        {
            username: "Jane Smith",
            time: "8:20 AM",
            lastMessage: "Can't wait for the meeting.",
            avatar: "/avatar.png"
        },
        {
            username: "Alice Johnson",
            time: "7:15 AM",
            lastMessage: "I'll get back to you soon.",
            avatar: "/avatar.png"
        },
        {
            username: "Bob Brown",
            time: "6:00 AM",
            lastMessage: "Let's catch up later.",
            avatar: "/avatar.png"
        },
        {
            username: "Charlie Davis",
            time: "5:45 AM",
            lastMessage: "Thanks for the update!",
            avatar: "/avatar.png"
        },
        {
            username: "Diana Evans",
            time: "5:00 AM",
            lastMessage: "See you at the event.",
            avatar: "/avatar.png"
        },
        {
            username: "Ethan Foster",
            time: "4:30 AM",
            lastMessage: "I'll send you the files.",
            avatar: "/avatar.png"
        },
        {
            username: "Fiona Garcia",
            time: "4:00 AM",
            lastMessage: "Can we reschedule?",
            avatar: "/avatar.png"
        },
        {
            username: "George Harris",
            time: "3:30 AM",
            lastMessage: "Looking forward to it!",
            avatar: "/avatar.png"
        }
    ];


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

            {/* List of conversations */}
            <div className="conversations">
                {/* Render multiple Conversation components */}
                {chats.map((chat, index) => (
                    <Link key={index} to={`/chat/${chat.username}`} className="conversation-link">
                        <Conversation chat={chat} />
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default ChatList;
