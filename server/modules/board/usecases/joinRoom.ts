import roomRepo from '../repositories/RoomRepository';
import { Socket } from 'socket.io';

export async function joinRoomUsecase(
  data: { room: string; name: string; id?: string },
  socket: Socket
) {
  const room = roomRepo.get(data.room);
  if (!room) return { status: 'failure' };

  let user = data.id ? room.getUser(data.id) : undefined;
  if (!user) user = room.addUser(data.name, data.id);

  await socket.join(room.id);
  socket.to(room.id).emit('user-changes', {
    action: 'join',
    user: { ...user, ts: Date.now() },
  });

  return { status: 'success', id: user.id };
}

