import React from "react";

function SelfMsg({ message, timeSent, status }) {
  return (
    <div className="self-msg">
      <div className="message-content">
        <div className="message-text">{message}</div>
        <div className="message-info">
          <span className="message-time">{timeSent}</span>
          {/* <div className={`message-status ${status}`}>
            <img src="/tick.svg" alt="status icon" />
            {status !== "sent" && <img src="/tick.svg" alt="status icon" />}
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default SelfMsg;