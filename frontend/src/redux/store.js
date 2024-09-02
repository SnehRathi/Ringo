import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice'; // Adjust the path as necessary
import loadingReducer from './loadingSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    loading: loadingReducer
    // Add other reducers here if needed
  },
});

export default store;