import roomRepo from '../repositories/RoomRepository';

export async function loadRoomDataUsecase(data: { room: string }) {
  const room = roomRepo.get(data.room);
  if (!room) return false;
  else return room.board.serialize();
}
