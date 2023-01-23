import { Action } from 'src/plugins/drawer';
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

  sendData(
    room: string | undefined,
    data: { actions: Action[]; user: string }
  ) {
    this.socket.send('sendData', { room, data }, (r) => {
      console.log(r);
    });
  }

  subscribe(cb: (data: any) => void) {
    this.socket.on('sendData', cb);
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
