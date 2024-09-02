import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import MainContainer from './components/main-container/MainContainer';
import Login from './components/login/Login';
import Register from './components/login/Register';
import { setUser } from './redux/userSlice';
import { setLoading } from './redux/loadingSlice';
import LoadingBar from './LoadingBar'; // Import the LoadingBar component

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const isLoading = useSelector((state) => state.loading.isLoading);
  const [tokenChecked, setTokenChecked] = useState(false); // State to track if the token check is complete

  useEffect(() => {
    const checkToken = async () => {
      // Show loading bar
      dispatch(setLoading(true));

      // Retrieve the token from local storage
      const token = localStorage.getItem('token');

      if (token) {
        // console.log("Token is present");
        try {
          const response = await fetch('http://localhost:5000/api/verify', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            // console.log(data.user);
            dispatch(setUser(data.user));
          } else {
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

      // Mark token check as complete and hide loading bar
      setTokenChecked(true);
      dispatch(setLoading(false));
    };

    checkToken();
  }, [dispatch]);

  if (!tokenChecked || isLoading) {
    // Show the loading bar while the token is being checked
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
            element={ <Login /> }
          />
          <Route
            path='/register'
            element={<Register />}
          />
          {/* Redirect any undefined routes to the login page */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
