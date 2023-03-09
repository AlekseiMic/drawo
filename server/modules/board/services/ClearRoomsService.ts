import rooms from '../repositories/RoomRepository';

const CHECK_INTERVAL = 5 * 60 * 1000;
const CLEAR_INTERVAL = 5 * 60 * 1000 * 6;

export class ClearRoomsService {
  private lastCheck: Record<string, number> = {};

  private intervalHandle: null | ReturnType<typeof setInterval> = null;

  constructor() {
    this.start();
  }

  start() {
    if (this.intervalHandle !== null) return;
    this.intervalHandle = setInterval(() => {
      const current = Date.now();
      rooms.getAll().forEach((room) => {
        const userCount = room.getUserCount();
        if (userCount > 0) return this.clear(room.id);
        if (this.lastCheck[room.id] > current - CLEAR_INTERVAL) return;
        if (!this.lastCheck[room.id]) {
          this.lastCheck[room.id] = current;
          return;
        }
        rooms.remove(room.id);
      });
    }, CHECK_INTERVAL);
  }

  stop() {
    if (!this.intervalHandle) return;
    clearInterval(this.intervalHandle);
    this.intervalHandle = null;
  }

  clear(room: string) {
    if (this.lastCheck[room]) delete this.lastCheck[room];
  }
}
