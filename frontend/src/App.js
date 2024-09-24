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
  // console.log(user);
  
  useEffect(() => {
    const checkToken = async () => {
      // Show loading bar
      dispatch(setLoading(true));

      // Retrieve the token from local storage
      const token = localStorage.getItem('ringoToken');

      if (token) {
        try {
          const response = await fetch('http://localhost:5000/api/verify', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            dispatch(setUser(data.user));
          } else {
            localStorage.removeItem('ringoToken');
            dispatch(setUser(null));
          }
        } catch (error) {
          console.error('Error verifying token:', error);
          localStorage.removeItem('ringoToken');
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
            element={user && user.isLoggedIn ? <MainContainer viewMode={0} /> : <Navigate to="/login" />}
          />
          {/* view mode 1 to show a chat in the main container */}
          <Route
            path='/chat/:chatId'
            element={user && user.isLoggedIn ? <MainContainer viewMode={1} /> : <Navigate to="/login" />}
          />
          {/* Route for the login page */}
          <Route
            path='/login'
            element={<Login />}
          />
          <Route
            path='/register'
            element={<Register />}
          />
          {/* Route for all users */}
          {/* view mode 2 for showing allUsers in the main container */}
          <Route
            path='/user/allUsers'
            element={user && user.isLoggedIn ? <MainContainer viewMode={2} /> : <Navigate to="/login" />}
          />
          {/* Redirect any undefined routes to the login page */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
