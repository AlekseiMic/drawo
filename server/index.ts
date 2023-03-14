import { Server, Socket } from 'socket.io';
import boardModule from './modules/board/module';

const io = new Server({
  path: '/ws/',
  cors: {
    origin: '*',
    credentials: true,
  },
});

const onConnection = (socket: Socket) => {
  boardModule.init(io, socket);
};

io.on('connection', onConnection);

io.listen(3000);

console.log('Started socket server on 3000 port');

export {};
