import { io } from 'socket.io-client';

const socket = io('https://ringo-backend-na38.onrender.com', { autoConnect: false });

export default socket;
