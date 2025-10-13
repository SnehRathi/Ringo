"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddUserItem from "./AddUserItem";
import LinearProgress from "@mui/material/LinearProgress";
import { useRouter } from "next/navigation";
import { setOpenChat } from "../../redux/openChatSlice";
import { addChat, Chat, User as ChatUser } from "@/redux/chatsSlice";
import type { RootState } from "@/redux/store";
import styles from "./all-users.module.css";

interface User {
  _id: string;
  username: string;
  profilePicture: string;
}

export default function AllUsers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const router = useRouter();

  const user = useSelector((state: RootState) => state.user.user);
  const chats = useSelector((state: RootState) => state.chats.chats);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/user/getAllUsers/${user._id}`);
        const data: User[] = await res.json();
        setUsers(data);
        setFilteredUsers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user._id]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredUsers(users.filter(u => u.username.toLowerCase().includes(query)));
  };

  const handleMessage = async (recipientId: string) => {
    const existingChat = chats.find((chat: Chat) =>
      chat.participants.some(p => p._id === recipientId)
    );

    if (existingChat) {
      dispatch(setOpenChat({ chat: existingChat, temporary: false }));
      router.push(`/chat/${existingChat._id}`);
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/chat/checkOrCreate/${user._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipient_id: recipientId }),
      });
      const { chat }: { chat: Chat } = await res.json();
      dispatch(addChat(chat));
      dispatch(setOpenChat({ chat, temporary: false }));
      router.push(`/chat/${chat._id}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.allUsersSide}>
      <input
        type="text"
        placeholder="Search for a username"
        value={searchQuery}
        onChange={handleSearch}
        className={styles.searchBar}
      />
      <div className={styles.userList}>
        {loading && (
          <LinearProgress
            sx={{
              height: "3px",
              width: "100%",
              left: 0,
              "& .MuiLinearProgress-bar": { backgroundColor: "#ff0000" },
              backgroundColor: "#cccccc",
            }}
          />
        )}
        {filteredUsers.map(u => (
          <AddUserItem key={u._id} user={u} handleMessage={handleMessage} />
        ))}
      </div>
    </div>
  );
}
