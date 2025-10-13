"use client";

import styles from "./sidebar.module.css";
import UserInfo from "./UserInfo";
import ChatList from "./ChatList"; // import ChatList

export default function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <UserInfo />
      <ChatList /> {/* include ChatList here */}
    </div>
  );
}
