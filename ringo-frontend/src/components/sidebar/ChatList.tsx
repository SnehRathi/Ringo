"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenChat } from "../../redux/openChatSlice";
import Conversation from "./Conversation";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import styles from "./sidebar.module.css";

export default function ChatList() {
  const chats = useSelector((state: any) => state.chats.chats);
  const newChat = useSelector((state: any) => state.newChat);
  const openChat = useSelector((state: any) => state.openChat.chat);
  const user = useSelector((state: any) => state.user.user);

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();

  // Handle loading state
  useEffect(() => {
    setLoading(chats.length === 0);
  }, [chats]);

  // Handle opening a chat
  const handleOpenChat = (chat: any) => {
    dispatch(setOpenChat({ chat, temporary: false }));
    router.push(`/chat/${chat._id}`); // Navigate in Next.js
  };

  return (
    <div className={styles.chatList}>
      {/* Search bar */}
      <div className={styles.searchBar}>
        <label htmlFor="user-search-bar">
          <img src="/search.png" alt="Search icon" />
        </label>
        <input
          type="text"
          id="user-search-bar"
          name="searched-user"
          placeholder="Search..."
          autoComplete="off"
        />
      </div>

      {/* Conversations */}
      <div className={styles.conversations}>
        {loading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <div className={styles.skeletonConversation} key={index}>
              <Skeleton circle={true} height={50} width={50} />
              <div className={styles.skeletonText}>
                <Skeleton height={20} width={`60%`} />
                <Skeleton height={15} width={`80%`} />
              </div>
            </div>
          ))
        ) : (
          <>
            {/* Render temporary chat if exists */}
            {newChat && (
              <div
                onClick={() => handleOpenChat(newChat)}
                className={styles.conversationLink}
              >
                <Conversation
                  chat={newChat._id}
                  participants={newChat.participants}
                />
              </div>
            )}

            {/* Render all existing chats */}
            {chats.map((chat: any) => (
              <div
                key={chat._id}
                onClick={() => handleOpenChat(chat)}
                className={styles.conversationLink}
              >
                <Conversation
                  chat={chat._id}
                  participants={chat.participants}
                  lastMessage={chat.lastMessage?.content}
                  unreadCount={chat.unreadCount}
                  lastMessageDate={chat.lastMessage?.createdAt}
                  isChatOpen={openChat?._id === chat._id}
                />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
