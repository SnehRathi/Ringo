import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Import Provider from react-redux and your Redux store
import { Provider } from 'react-redux';
import store from './redux/store'; // Adjust the path as needed

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);