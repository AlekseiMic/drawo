import { nanoid } from 'nanoid';
import roomRepo from '../repositories/RoomRepository';
import { Room } from '../entities/Room';

export async function createRoomUsecase(data: {
  room: string;
  name: string;
  id?: string;
}) {
  if (data.room && roomRepo.exists(data.room)) {
    return { status: 'failure', reason: 'room already exists' };
  }

  let roomId = data.room;

  if (!roomId) {
    do {
      roomId = nanoid(10);
    } while (roomRepo.exists(roomId));
  }
  const room = new Room(roomId);
  const user = room.addUser(data.name, data.id);
  roomRepo.save(room);

  return { status: 'success', room: roomId, id: user.id };
}
