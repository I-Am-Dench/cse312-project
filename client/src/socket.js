import { io } from 'socket.io-client';

const uri = import.meta.env.PROD
  ? 'https://rossien.com/'
  : 'http://localhost:8080';
const socket = io(uri, {
  autoConnect: false,
  transports: ['websocket'],
});
export default socket;