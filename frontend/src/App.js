import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import MainContainer from './components/main-container/MainContainer';
import Login from './components/login/Login';
import Register from './components/login/Register';
import ResetPassword,{NewPassword} from './components/login/ResetPassword';
import { setUser } from './redux/userSlice';
import { setLoading } from './redux/loadingSlice';
import { fetchUserChats } from './redux/chatsSlice';
import LoadingBar from './LoadingBar';
import socket from './Socket'; // Singleton socket instance

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const isLoading = useSelector((state) => state.loading.isLoading);
  const [tokenChecked, setTokenChecked] = useState(false);

  // Validate token and fetch user data
  useEffect(() => {
    const validateToken = async () => {
      dispatch(setLoading(true));

      const token = localStorage.getItem('ringoToken');
      if (token) {
        try {
          const response = await fetch('http://localhost:5000/api/verify', {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.ok) {
            const data = await response.json();
            dispatch(setUser(data.user));
            dispatch(fetchUserChats(token));
          } else {
            handleInvalidToken();
          }
        } catch {
          handleInvalidToken();
        }
      } else {
        handleInvalidToken();
      }

      setTokenChecked(true);
      dispatch(setLoading(false));
    };

    const handleInvalidToken = () => {
      localStorage.removeItem('ringoToken');
      dispatch(setUser(null));
    };

    validateToken();
  }, [dispatch]);

  // Manage socket connection and join chat rooms
  useEffect(() => {
    if (tokenChecked && user?.isLoggedIn) {
      if (!socket.connected) {
        socket.connect();
      }

      socket.on('connect', () => {
        user.chats.forEach((chat) => {
          socket.emit('joinRoom', chat._id);
        });
      });
    }
  }, [tokenChecked, user]);

  if (!tokenChecked || isLoading) {
    return (
      <div className="App">
        <LoadingBar loading={isLoading} />
      </div>
    );
  }

  const renderRoute = (element, redirectTo = '/login') =>
    user?.isLoggedIn ? element : <Navigate to={redirectTo} />;

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={renderRoute(<MainContainer viewMode={0} socket={socket} />)} />
          <Route path="/chat/:chatId" element={renderRoute(<MainContainer viewMode={1} socket={socket} />)} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/user/allUsers" element={renderRoute(<MainContainer viewMode={2} socket={socket} />)} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/reset-password/new-password" element={<NewPassword />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
