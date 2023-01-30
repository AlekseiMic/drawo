import { Server } from 'socket.io';
import { nanoid } from 'nanoid';

const rooms: Record<string, { users: { name: string; id: string }[] }> = {};
const deleteList: { room: string; ts: ReturnType<typeof Date.now> }[] = [];

function addToDeleteList(room: string) {
  deleteList.push({ room, ts: Date.now() });
}

const io = new Server({
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
});

io.on('connection', (socket) => {
  socket.on(
    'join',
    async (
      { id, room, name }: { room: string; name: string; id?: string },
      callback
    ) => {
      if (!(room in rooms)) return callback({ status: 'failure' });

      let user = rooms[room].users.find((u) => u.id === id);

      if (!user) {
        user = { id: id ?? nanoid(15), name };
        rooms[room].users.push(user);
      }
      socket.join(room);
      socket.to(room).emit('user-changes', {
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

      rooms[room] = { users: [user] };
      callback({ status: 'success', room, id: user.id });
    }
  );

  socket.on(
    'sendData',
    (
      { room, data }: { room: string; data: { actions: any[]; user: string } },
      callback
    ) => {
      socket.to(room).emit('sendData', data);
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
