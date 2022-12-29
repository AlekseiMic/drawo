import { Drawer } from "../Drawer";
import { Color } from "../interfaces/Color";
import { IScratch, ScratchState } from "../interfaces/IScratch";
import { Point } from "../interfaces/Point";
import { Pointable } from "../interfaces/Pointable";

export class LineScratch implements IScratch, Pointable {
  private _id: string;

  state = ScratchState.active;

  _start: Point = { x: 0, y: 0 };

  _end: Point = { x: 0, y: 0 };

  points: Uint32Array = new Uint32Array();

  rect: { left: number; right: number; top: number; bottom: number } = {
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  };

  width: number = 0;

  height: number = 0;

  color: Color = {
    r: 155,
    g: 200,
    b: 0,
    a: 154,
  };

  constructor() {
    this._id = Date.now() + "";
  }

  set start(p: Point) {
    this._start = p;
    if (this._end) this.process();
  }

  set end(p: Point) {
    this._end = p;
    if (this._start) this.process();
  }

  move(p: Point) {
    this.rect = {
      left: this.rect.left + p.x,
      top: this.rect.top + p.y,
      right: this.rect.right + p.x,
      bottom: this.rect.bottom + p.y,
    };

    this._start = { x: this._start.x + p.x, y: this._start.y + p.y };
    this._end = { x: this._end.x + p.x, y: this._end.y + p.y };
  }

  getBoundingRect(): {
    left: number;
    right: number;
    top: number;
    bottom: number;
  } {
    return this.rect;
  }

  isIntersects(point: Point, region = 1) {
    const distance =
      Math.abs(
        (this._end.x - this._start.x) * (this._start.y - point.y) -
          (this._start.x - point.x) * (this._end.y - this._start.y)
      ) /
      Math.sqrt(
        (this._end.x - this._start.x) ** 2 + (this._end.y - this._start.y) ** 2
      );

    return distance <= region;
  }

  process() {
    const left = Math.min(this._start.x, this._end.x);
    const top = Math.min(this._start.y, this._end.y);
    const right = Math.max(this._start.x, this._end.x);
    const bottom = Math.max(this._start.y, this._end.y);

    const width = right - left + 1;
    const height = bottom - top + 1;

    this.width = width;
    this.height = height;
    this.rect = { left, top, right, bottom };

    const x1 = this._start.x;
    const y1 = this._start.y;

    const x2 = this._end.x;
    const y2 = this._end.y;


    const dx = Math.abs(x2 - x1);
    const sx = x1 < x2 ? 1 : -1;

    const dy = -Math.abs(y2 - y1);
    const sy = y1 < y2 ? 1 : -1;

    let x = x1;
    let y = y1;
    let e2;
    let er = dx + dy;

    if (width <= 0 || height <= 0) return;

    const points = [];

    let i = 0;
    while (true) {
      if (x === x2 && y === y2) break;
      points[i++] = x - left;
      points[i++] = y - top;

      e2 = 2 * er;
      if (e2 > dy) {
        er += dy;
        x += sx;
      }
      if (e2 < dx) {
        er += dx;
        y += sy;
      }
    }

    this.points = new Uint32Array(points);
  }

  draw(data: ImageData, drawer: Drawer) {
    drawer.putImageData(data, this);
  }

  get id(): string {
    return this._id;
  }
}
