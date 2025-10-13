"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../sidebar/Sidebar";
// import Chat from "../chat/Chat";
import WelcomePage from "./WelcomePage";
import AllUsers from "./AllUsers";
import { addMessageToChatForReceiver } from "@/redux/chatsSlice";
import socket from "../../utils/Socket";
import styles from "./main-container.module.css"; // ✅ import CSS module

interface MainContainerProps {
  viewMode: number;
}

export default function MainContainer({ viewMode }: MainContainerProps) {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user.user);
  const openChat = useSelector((state: any) => state.openChat.chat);

  useEffect(() => {
    if (socket && user?.isLoggedIn) {
      const handleReceiveMessage = (message: any) => {
        dispatch(addMessageToChatForReceiver({ message, currentUserId: user._id }));
      };

      socket.on("receiveMessage", handleReceiveMessage);

      return () => {
        socket.off("receiveMessage", handleReceiveMessage);
      };
    }
  }, [user?._id, openChat?.chat?._id, dispatch]);


  return (
    <div className={styles.mainContainer}>
      <Sidebar />
      {viewMode === 0 && <WelcomePage />}
      {/* {viewMode === 1 && <Chat socket={socket} />} */}
      {/* {viewMode === 2 && <AllUsers />} */}
    </div>
  );
}
