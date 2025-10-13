"use client";

import { useSelector } from "react-redux";
import styles from "./conversation.module.css";

interface Participant {
  _id: string;
  username: string;
  profilePicture: string;
}

interface ConversationProps {
  participants: Participant[];
  lastMessage?: string;
  unreadCount?: number;
  lastMessageDate?: string;
  isChatOpen?: boolean;
}

interface RootState {
  user: {
    user: {
      _id: string;
    };
  };
}

export default function Conversation({
  participants,
  lastMessage,
  unreadCount = 0,
  lastMessageDate,
  isChatOpen = false,
}: ConversationProps) {
  const loggedInUser = useSelector((state: RootState) => state.user.user);

  // Find the recipient by filtering out the logged-in user
  const recipient = participants && participants.length > 1
    ? participants.find((p) => p._id !== loggedInUser._id)
    : null;

  // Format the lastMessageDate to HH:MM
  const formattedDate = lastMessageDate
    ? new Date(lastMessageDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";

  return (
    <div className={`${styles.conversation} ${isChatOpen ? styles.activeChat : ""}`}>
      {recipient && (
        <>
          <img src={recipient.profilePicture} alt="user-profile" />
          <div className={styles.usernameLastmsg}>
            <div className={styles.usernameTime}>
              <span className={styles.username}>{recipient.username}</span>
              <span className={styles.lastMsgTime}>{formattedDate}</span>
            </div>
            <div className={styles.lastmsgUnreadCount}>
              <p className={styles.lastMsg}>{lastMessage || "No messages yet"}</p>
              {unreadCount > 0 && (
                <div className={styles.unreadCount}>{unreadCount}</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
