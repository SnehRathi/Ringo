import React from "react";
import SelfMsg from "./SelfMsg";
import OtherMsg from "./OtherMsg";

function MessageSection() {
    return (
        <div className="msg-section">
            <OtherMsg
                profilePhoto="/favicon.png"
                senderName="John Doe"
                message="Hey, how's it going?"
                timeSent="10:45 AM"
            />
            <OtherMsg
                profilePhoto="/favicon.png"
                senderName="John Doe"
                message="Hey, how's it going?"
                timeSent="10:45 AM"
            />

            <SelfMsg
                message="Hey, I'll be there in 10 minutes!"
                timeSent="10:45 AM"
                status="seen"
            />
            <OtherMsg
                profilePhoto="/favicon.png"
                senderName="John Doe"
                message="Hey, how's it going?"
                timeSent="10:45 AM"
            />
            <OtherMsg
                profilePhoto="/favicon.png"
                senderName="John Doe"
                message="Hey, how's it going?"
                timeSent="10:45 AM"
            />
            <SelfMsg
                message="Hey, I'll be there in 10 minutes!"
                timeSent="10:45 AM"
                status="seen"
            />
            <SelfMsg
                message="Hey, I'll be there in 10 minutes!"
                timeSent="10:45 AM"
                status="seen"
            />
            <SelfMsg
                message="Hey, I'll be there in 10 minutes!"
                timeSent="10:45 AM"
                status="seen"
            />
        </div>
    )
}

export default MessageSection;