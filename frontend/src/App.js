import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import MainContainer from './components/main-container/MainContainer';
import Login from './components/login/Login';
import { setUser } from './redux/user/userSlice';
import LoadingBar from './LoadingBar'; // Import the LoadingBar component

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [loading, setLoading] = useState(true); // Add loading state
  const [showLoadingBar, setShowLoadingBar] = useState(false); // To manage loading bar visibility

  useEffect(() => {
    const checkToken = async () => {
      // Show loading bar
      setShowLoadingBar(true);

      // Retrieve the token from local storage
      const token = localStorage.getItem('token');

      if (token) {
        // Verify token and fetch user details from the backend
        try {
          const response = await fetch('http://localhost:5000/api/verify', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            // Set the user in the Redux store
            dispatch(setUser(data.user));
          } else {
            // If token is not valid, clear the token and user data
            localStorage.removeItem('token');
            dispatch(setUser(null));
          }
        } catch (error) {
          console.error('Error verifying token:', error);
          localStorage.removeItem('token');
          dispatch(setUser(null));
        }
      } else {
        dispatch(setUser(null));
      }

      // Hide loading bar after a minimum of 2 seconds
      setTimeout(() => {
        setLoading(false);
        setShowLoadingBar(false);
      }, 2000);
    };

    checkToken();
  }, [dispatch]);


  return (
    <Router>
      <div className="App">
        {
          loading ? <LoadingBar loading={showLoadingBar} /> :
            <Routes>
              {/* Route for the main container */}
              <Route
                path='/'
                element={user && user.isLoggedIn ? <MainContainer isChatOpen={false} /> : <Navigate to="/login" />}
              />
              <Route
                path='/chat/:chatId'
                element={user && user.isLoggedIn ? <MainContainer isChatOpen={true} /> : <Navigate to="/login" />}
              />
              {/* Route for the login page */}
              <Route
                path='/login'
                element={<Login />}
              />
              {/* Redirect any undefined routes to the home page */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        }
      </div>
    </Router>
  );
}

export default App;
