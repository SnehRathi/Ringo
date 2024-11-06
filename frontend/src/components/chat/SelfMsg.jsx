import React from "react";

function SelfMsg({ message, file, timeSent, status }) {
  return (
    <div className="self-msg">
      <div className="message-content">
        {/* Display the file if it's present */}
        {file && file.fileType === 'image' ? (
          <div className="image-wrapper">
            <img
              src={file.fileUrl}
              alt="Sent Attachment"
              className="clear-image" // Display the full image since it's already sent
            />
          </div>
        ) : (
          <div className="message-text">{message}</div>
        )}
        <div className="message-info">
          <span className="message-time">{timeSent}</span>
          {/* Display message status */}
          <span className={`message-status ${status}`}>{status}</span>
        </div>
      </div>
    </div>
  );
}

export default SelfMsg;