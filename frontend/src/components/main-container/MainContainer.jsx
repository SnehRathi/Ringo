import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from '../sidebar/Sidebar';
import Chat from '../chat/Chat';
import WelcomePage from './WelcomePage';
import AllUsers from './AllUsers';
import { addMessageToChatForReceiver } from '../../redux/chatsSlice';
import './main-container.css';


function MainContainer({ viewMode, socket }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const openChat = useSelector((state) => state.openChat.chat);

  // Listen for incoming messages and update the open chat or relevant chat
  useEffect(() => {
    if (socket && user?.isLoggedIn) {
      const handleReceiveMessage = (message) => {
        console.log("Received message:", message);
        // const isChatOpen = openChat?._id === message.chat;

        // Add message locally to the sender's open chat area
        dispatch(addMessageToChatForReceiver({ message: message, currentUserId: user._id }));
      };

      socket.on('receiveMessage', handleReceiveMessage);

      return () => {
        socket.off('receiveMessage', handleReceiveMessage);
      };
    }
  }, [socket, user, openChat, dispatch]);

  return (
    <div className="main-container">
      <Sidebar />
      {viewMode === 0 && <WelcomePage />}
      {viewMode === 1 && <Chat socket={socket} />}
      {viewMode === 2 && <AllUsers />}
    </div>
  );
}

export default MainContainer;
