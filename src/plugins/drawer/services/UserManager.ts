import { User } from '../entities/User';

export class UserManager {
  public active?: string;

  public users: User[] = [];

  private _callbacks: Record<'change' | 'move', ((userId?: string) => void)[]> =
    { change: [], move: [] };

  serialize() {
    return this.users;
  }

  deserialize(data: any) {
    this.users =
      data?.map((u: User) => {
        return new User(u.id, u.name, u.isObserver, u.center);
      }) ?? [];
  }

  clear() {
    this.users = [];
    this._callbacks = { change: [], move: [] };
  }

  subscribeOnUserChange(cb: (typeof this._callbacks)['change'][0]) {
    this._callbacks.change.push(cb);
  }

  unsubscribeOnUserChange(cb: (typeof this._callbacks)['change'][0]) {
    this._callbacks.change = this._callbacks.change.filter(
      (storedCb) => cb !== storedCb
    );
  }

  subscribeOnUserMove(cb: (typeof this._callbacks)['move'][0]) {
    this._callbacks.move.push(cb);
  }

  unsubscribeOnUserMove(cb: (typeof this._callbacks)['move'][0]) {
    this._callbacks.move = this._callbacks.move.filter(
      (storedCb) => cb !== storedCb
    );
  }

  move(userId: string, x: number, y: number) {
    const user = this.getById(userId);
    if (!user) return;
    user.move(x, y);
    this._callbacks.move.forEach((cb) => cb(userId));
  }

  setActive(id?: string) {
    if (this.active === id) return;
    this.active = id;
    this._callbacks.change.forEach((cb) => cb(id));
  }

  getActive() {
    if (!this.active) return undefined;
    return this.getById(this.active);
  }

  getById(id: string) {
    return this.users.find((u) => u.id === id);
  }

  add(user: User) {
    this.users.push(user);
  }

  remove(id: string) {
    this.users = this.users.filter((o) => o.id !== id);
    if (this.active === id) this.setActive(this.users[0]?.id);
  }
}
