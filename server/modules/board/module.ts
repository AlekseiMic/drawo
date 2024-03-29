import { Server, Socket } from 'socket.io';
import { BoardController } from './controllers/BoardController';
import { ClearRoomsService } from './services/ClearRoomsService';

export default {
  init(io: Server, socket: Socket, prefix?: string) {
    new BoardController().init(io, socket, prefix);
    new ClearRoomsService();
  },
};
