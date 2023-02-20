import { Server } from 'socket.io';
import { nanoid } from 'nanoid';
import { Manager } from '../src/plugins/drawer/';
// @ts-ignore
import { ServerManager } from './ServerManager.js';

const rooms: Record<
  string,
  { board: Manager; users: { name: string; id: string }[] }
> = {};
const deleteList: { room: string; ts: ReturnType<typeof Date.now> }[] = [];

function addToDeleteList(room: string) {
  deleteList.push({ room, ts: Date.now() });
}

const io = new Server({
  cors: {
    origin: '*',
    credentials: true,
  },
});

io.on('connection', (socket) => {
  socket.on(
    'join',
    async (
      { id, room: roomId, name }: { room: string; name: string; id?: string },
      callback
    ) => {
      const room = rooms[roomId];
      if (!room) return callback({ status: 'failure' });

      let user = room.users.find((u) => u.id === id);

      if (!user) {
        user = { id: id ?? nanoid(15), name };
        room.users.push(user);
      }
      socket.join(roomId);
      socket.to(roomId).emit('user-changes', {
        action: 'join',
        user: { ...user, ts: Date.now() },
      });
      callback({ status: 'success', id: user.id });
    }
  );

  socket.on(
    'create',
    (data: { room?: string; id?: string; name: string }, callback) => {
      let room = data.room ?? '';
      const user = { name: data.name, id: data.id ?? nanoid(15) };

      if (room in rooms) {
        callback({ status: 'failure', reason: 'room already exists' });
        return;
      }

      if (!room) {
        do {
          room = nanoid(10);
        } while (room in rooms);
      }

      rooms[room] = { users: [user], board: new ServerManager() };
      callback({ status: 'success', room, id: user.id });
    }
  );

  socket.on('loadData', ({ room: roomId }: { room: string }, callback) => {
    const room = rooms[roomId];
    if (!room) callback(false);
    else callback(room.board.serialize());
  });

  socket.on(
    'sendData',
    (
      {
        room: roomId,
        data,
      }: { room: string; data: { actions: any[]; user: string } },
      callback
    ) => {
      socket.to(roomId).emit('sendData', data);
      const room = rooms[roomId];
      room.board.actions.dispatch(data.actions);
      callback(true);
    }
  );

  socket.on('quit', ({ room, id }: { room: string; id: string }, callback) => {
    if (!(room in rooms)) return callback(false);
    const prevUsersCount = rooms[room].users.length;
    rooms[room].users = rooms[room].users.filter((u) => u.id !== id);
    if (rooms[room].users.length === prevUsersCount) return callback(false);
    socket.to(room).emit('user-changes', {
      action: 'leave',
      user: { id },
    });
    callback(true);

    if (rooms[room].users.length === 0) addToDeleteList(room);
  });
});

io.listen(5441);

export {};
