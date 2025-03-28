import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  transports: ["websocket","polling"],
  withCredentials: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});
// Prevents socket from disconnecting when changing components
if (!socket.connected) {
    socket.connect();
  }
export default socket;
