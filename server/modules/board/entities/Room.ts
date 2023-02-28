import { Manager } from '@plugins/drawer';
import {ServerManager} from '../services/ServerManager';
import { nanoid } from 'nanoid';

export class Room {
  public id: string;

  private _board: Manager;

  private _users: { name: string; id: string }[] = [];

  constructor(id: string) {
    this._board = new ServerManager();
    this.id = id;
  }

  get board() {
    return this._board;
  }

  addUser(name: string, id?: string) {
    const existingUser = id?this.getUser(id):undefined;
    if (existingUser) return existingUser;
    const user = { name, id: id ?? nanoid(15) };
    this._users.push(user);
    return user;
  }

  getUser(id: string) {
    return this._users.find((u) => u.id === id);
  }

  getUserByName(name: string) {
    return this._users.find((u) => u.name === name);
  }

  removeUser(id: string) {
    const index = this._users.findIndex((u) => u.id === id);
    if (index === -1) return false;
    return this._users.splice(index).length === 1;
  }
}
