"use client";

import React from "react";
import ChatIcon from "@mui/icons-material/Chat";

interface AddUserItemProps {
  user: {
    _id: string;
    username: string;
    profilePicture: string;
  };
  handleMessage: (id: string) => void;
}

export default function AddUserItem({ user, handleMessage }: AddUserItemProps) {
  return (
    <div className="user-item">
      <img src={user.profilePicture} alt={user.username} className="profile-pic" />
      <span className="username">{user.username}</span>
      <div className="user-actions">
        <button onClick={() => handleMessage(user._id)} className="action-btn">
          Chat <ChatIcon />
        </button>
      </div>
    </div>
  );
}
