import { Server, Socket } from 'socket.io';
import boardModule from './modules/board/module';

const io = new Server({
  cors: {
    origin: '*',
    credentials: true,
  },
});

const onConnection = (socket: Socket) => {
  boardModule.init(io, socket);
};

io.on('connection', onConnection);

io.listen(5441);

export {};
