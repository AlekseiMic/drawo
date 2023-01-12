import { Server } from 'socket.io';

const io = new Server({
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log('connected');
  socket.on('join', (room: string) => {
    console.log('join: ', room);
    socket.emit('joinResponse', true);
  });
});

io.listen(5441);

export {};
