import { SocketService } from './SocketService';

type JoinResponse = { status: 'success' | 'failure'; userId?: string };
type CreateResponse = { room: string; userId: string };

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

  roomExist(room: string) {
    return new Promise<boolean>((r) => {
      this.socket.send<string, boolean>('exist', room, r);
    });
  }

  joinRoom(data: { room: string; username: string }) {
    return new Promise<JoinResponse>((r) => {
      this.socket.send<typeof data, JoinResponse>('join', data, r);
    });
  }

  createRoom(data: { username: string; userId?: string }) {
    return new Promise<CreateResponse>((r) => {
      this.socket.send<typeof data, CreateResponse>('create', data, r);
    });
  }
}
