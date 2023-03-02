import { Point } from '../interfaces';

export interface IRawUser {
  id: string;
  name: string;
  isObserver?: boolean;
  center: Point;
}

export class User implements IRawUser {
  public id: string;

  public name: string;

  public isObserver: boolean = false;

  public center = {
    x: 1000,
    y: 1000,
  };

  setCenter(position: { x: number; y: number }) {
    this.center = { x: position.x ?? 0, y: position.y ?? 0 };
  }

  constructor(
    id: string,
    name: string,
    isObserver?: boolean,
    center?: { x: number; y: number }
  ) {
    this.id = id;
    this.name = name;
    if (isObserver) this.isObserver = true;
    if (center) this.setCenter(center);
  }

  move(x: number, y: number) {
    this.center = {
      x: this.center.x - x,
      y: this.center.y - y,
    };
  }

  change(data?: { name?: string; isObserver?: boolean }) {
    if (data?.name) this.name = data.name;
    if (data?.isObserver !== undefined) this.isObserver = data.isObserver;
  }
}
