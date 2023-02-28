import { BaseController } from './BaseController';
import { nanoid } from 'nanoid';
import roomRepo from '../repositories/RoomRepository';
import { Room } from '../entities/Room';
import { Socket } from 'socket.io';

export class BoardController extends BaseController {
  protected routes = [
    { path: 'join', method: BoardController.join.bind(this) },
    { path: 'create', method: BoardController.create.bind(this) },
    { path: 'leave', method: BoardController.leave.bind(this) },
    { path: 'sendData', method: BoardController.sendData.bind(this) },
    { path: 'loadData', method: BoardController.loadData.bind(this) },
  ];

  private static async loadData(data: { room: string }) {
    const room = roomRepo.get(data.room);
    if (!room) return false;
    else return room.board.serialize();
  }

  private static async sendData(data: { room: string; data: { actions: any[]; user: string } }, socket: Socket) {
      socket.to(data.room).emit('sendData', data);
      const room = roomRepo.get(data.room);
      if (!room) return false;
      room.board.actions.dispatch(data.data.actions);
      return true;
  }

  private static async join(
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

  private static async create(data: {
    room?: string;
    id?: string;
    name: string;
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

  private static async leave(data: { room: string; id: string }, socket: Socket) {
    const room = roomRepo.get(data.room);
    if (!room) return false;

    if(!room.removeUser(data.id)) return false;

    socket.to(room.id).emit('user-changes', {
      action: 'leave',
      user: { id: data.id },
    });

    return true;
  }
}
