// utils/Socket.ts
import { io, Socket } from "socket.io-client";

// Create a singleton socket instance
const socket: Socket = io("http://localhost:5000", {
  autoConnect: false, // Connect manually when needed
});

export default socket;
