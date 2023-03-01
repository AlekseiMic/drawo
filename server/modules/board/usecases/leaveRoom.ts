import roomRepo from '../repositories/RoomRepository';
import { Socket } from 'socket.io';

export async function leaveRoomUsecase(
  data: { room: string; id: string },
  socket: Socket
) {
  const room = roomRepo.get(data.room);
  if (!room) return false;

  if (!room.removeUser(data.id)) return false;

  socket.to(room.id).emit('user-changes', {
    action: 'leave',
    user: { id: data.id },
  });

  return true;
}
