import { io } from 'socket.io-client';
const socket = io('http://localhost:8080', {
  autoConnect: false,
  transports: ['websocket'],
});
export default socket;
