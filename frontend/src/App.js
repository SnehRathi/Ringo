import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import MainContainer from './components/main-container/MainContainer';
import Login from './components/login/Login';
import Register from './components/login/Register';
import { setUser } from './redux/userSlice';
import { setLoading } from './redux/loadingSlice';
import { fetchUserChats } from './redux/chatsSlice'; // Import fetchUserChats
import LoadingBar from './LoadingBar';

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const isLoading = useSelector((state) => state.loading.isLoading);
  const [tokenChecked, setTokenChecked] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      dispatch(setLoading(true));

      const token = localStorage.getItem('ringoToken');
      if (token) {
        try {
          const response = await fetch('http://localhost:5000/api/verify', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
          });
          if (response.ok) {
            const data = await response.json();
            dispatch(setUser(data.user));

            // Fetch chats once user is authenticated
            dispatch(fetchUserChats(token));
          } else {
            localStorage.removeItem('ringoToken');
            dispatch(setUser(null));
          }
        } catch (error) {
          localStorage.removeItem('ringoToken');
          dispatch(setUser(null));
        }
      } else {
        dispatch(setUser(null));
      }

      setTokenChecked(true);
      dispatch(setLoading(false));
    };

    checkToken();
  }, [dispatch]);

  if (!tokenChecked || isLoading) {
    return (
      <div className="App">
        <LoadingBar loading={isLoading} />
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path='/'
            element={user && user.isLoggedIn ? <MainContainer viewMode={0} /> : <Navigate to="/login" />}
          />
          <Route
            path='/chat/:chatId'
            element={user && user.isLoggedIn ? <MainContainer viewMode={1} /> : <Navigate to="/login" />}
          />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/user/allUsers' element={user && user.isLoggedIn ? <MainContainer viewMode={2} /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
