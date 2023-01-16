import { Server } from 'socket.io';
import { nanoid } from 'nanoid';

const rooms: Record<string, { users: { username: string; id: string }[] }> = {};

const io = new Server({
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
});

io.on('connection', (socket) => {
  socket.on(
    'join',
    (
      {
        userId,
        room,
        username,
      }: { room: string; username: string; userId?: string },
      callback
    ) => {
      if (!(room in rooms)) return callback({ status: 'failure' });
      let user = rooms[room].users.find((u) => u.id === userId);
      if (!user) {
        user = { id: userId ?? nanoid(15), username };
        rooms[room].users.push(user);
      }
      callback({ status: 'success', userId: user.id });
    }
  );

  socket.on(
    'create',
    (data: { userId?: string; username: string }, callback) => {
      let room = '';
      const userId = data?.userId ?? nanoid(15);

      do {
        room = nanoid(10);
      } while (room in rooms);

      rooms[room] = { users: [{ username: data.username, id: userId }] };
      callback({ room, userId });
    }
  );

  socket.on('exist', (room: string, callback) => {
    callback(room in rooms);
  });
});

io.listen(5441);

export {};
