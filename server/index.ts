import dotenv from 'dotenv';
import { Server, Socket } from 'socket.io';
import boardModule from './modules/board/module';
dotenv.config();

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

const port = Number(process.env.VITE_API_PORT ?? 3000);

io.listen(port);

console.log('Started socket server on ' + port + ' port');

export {};
