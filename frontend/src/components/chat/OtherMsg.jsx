import React from "react";

function OtherMsg({ profilePhoto, senderName, message, timeSent }) {
  return (
    <div className="other-msg">
      <img src={profilePhoto} alt={`${senderName}'s profile`} className="profile-photo" />
      <div className="message-content">
        <div className="sender-name">{senderName}</div>
        <div className="message-text">{message}</div>
        <div className="message-time">{timeSent}</div>
      </div>
    </div>
  );
}

export default OtherMsg;
