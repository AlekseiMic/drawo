import roomRepo from '../repositories/RoomRepository';
import { Socket } from 'socket.io';

export async function receiveDataUsecase(
  data: { room: string; data: { actions: any[]; user: string } },
  socket: Socket
) {
  socket.to(data.room).emit('sendData', data.data);
  const room = roomRepo.get(data.room);
  if (!room) return false;
  room.board.actions.dispatch(data.data.actions);
  return true;
}
