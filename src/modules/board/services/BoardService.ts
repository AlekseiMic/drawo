import { Action } from '@plugins/drawer';
import { SocketService } from './SocketService';

export enum ResponseStatus {
  Success = 'success',
  Failure = 'failure',
}

type Response<T> = {
  status: ResponseStatus;
  reason?: string;
} & T;

type JoinResponse = Response<{ id?: string }>;
type QuitResponse = Response<{}>;
type CreateResponse = Response<{ room: string; id: string }>;

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

  loadData(room: string) {
    return new Promise<JoinResponse>((r) => {
      this.socket.send<{ room: string }, any>('loadData', { room }, r);
    });
  }

  sendData(
    room: string | undefined,
    data: { actions: Action[]; user: string }
  ) {
    this.socket.send('sendData', { room, data }, () => {});
  }

  subscribeToUsersChanges(cb: (data: any) => void) {
    this.socket.on('user-changes', cb);
  }

  subscribe(cb: (data: any) => void) {
    this.socket.on('sendData', cb);
  }

  unsubscribe(cb: (data: any) => void) {
    this.socket.off('sendData', cb);
  }

  unsubscribeToUsersChanges(cb: (data: any) => void) {
    this.socket.off('user-changes', cb);
  }

  joinRoom(data: { room: string; id: string; name: string }) {
    return new Promise<JoinResponse>((r) => {
      this.socket.send<typeof data, JoinResponse>('join', data, r);
    });
  }

  quitRoom(data: { room: string; id: string }) {
    return new Promise<QuitResponse>((r) => {
      this.socket.send<typeof data, QuitResponse>('leave', data, r);
    });
  }

  createRoom(data: { room?: string; name: string; id?: string }) {
    return new Promise<CreateResponse>((r) => {
      this.socket.send<typeof data, CreateResponse>('create', data, r);
    });
  }
}
