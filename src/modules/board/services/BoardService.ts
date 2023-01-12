import { SocketService } from './SocketService';

export class BoardService {
  private socket: SocketService;

  constructor(socket: SocketService) {
    this.socket = socket;
  }

  connect() {
    this.socket.connect();
  }

  disconnect() {
    this.socket.disconnect();
  }

  joinRoom(room: string) {
    return new Promise((resolve, rej) => {
      try {
        this.socket.send<string, boolean>('join', room, (res) => {
          resolve(res);
        });
      } catch {
        rej();
      }
    });
  }
}
