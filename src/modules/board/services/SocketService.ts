import io from 'socket.io-client';

export class SocketService {
  private connection: ReturnType<typeof io>;

  constructor(url: string) {
    this.connection = io(url);
  }

  on(event: string, cb: (data: unknown) => void) {
    this.connection.on(event, cb);
    console.log('subscribed');
    console.log(event);
    console.log(this.connection.hasListeners(event));
  }

  connect() {
    if (this.connection.connected) return;
    this.connection.connect();
  }

  disconnect() {
    if (!this.connection.connected) return;
    this.connection.disconnect();
  }

  send<T = unknown, R = unknown>(
    event: string,
    data: T,
    callback?: (_res: R) => void
  ) {
    this.connection.emit(event, data, callback);
  }
}
