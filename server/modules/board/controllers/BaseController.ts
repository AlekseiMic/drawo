import { Server, Socket } from 'socket.io';

export abstract class BaseController {
  protected abstract routes: {
    path: string;
    method: (...data: any[]) => Promise<any>;
  }[];

  init(io: Server, socket: Socket, _prefix?: string) {
    const prefix = _prefix ? _prefix + '/' : '';
    this.routes.forEach(({ path, method }) => {
      socket.on(`${prefix}${path}`, async (data: any, callback: any) => {
        BaseController.response(callback, await method(data, socket));
      });
    });
  }

  private static response(
    callback: undefined | ((data: unknown) => void),
    data: unknown
  ) {
    if (typeof callback === 'function') callback(data);
  }
}
