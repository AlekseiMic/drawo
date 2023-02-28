import { Room } from '../entities/Room';

export class RoomRepository {
  private _data: Record<string, Room> = {};

  get(id: string): Room {
    return this._data[id];
  }

  save(room: Room) {
    if (this.exists(room.id)) throw new Error('ROOM_EXISTS');
    this._data[room.id] = room;
    return true;
  }

  exists(id: string) {
    return id in this._data;
  }

  remove(id: string) {
    if (!this._data[id]) return false;
    delete this._data[id];
    return true;
  }

  update(room: Room) {
    if (!this._data[room.id]) return false;
    this._data[room.id] = room;
    return true;
  }
}

export default new RoomRepository();
