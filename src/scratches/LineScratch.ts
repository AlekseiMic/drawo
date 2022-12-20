import { Drawer, StylesConfig } from "../Drawer";
import { IScratch } from "../interfaces/IScratch";
import { Point } from "../interfaces/Point";
import { Layer } from "../Layer";

export class LineScratch implements IScratch {
  _start: Point = { x: 0, y: 0 };

  _end: Point = { x: 0, y: 0 };

  points: Map<number, Point> = new Map();

  rect: { left: number; right: number; top: number; bottom: number } = {
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  };

  width: number = 0;

  height: number = 0;

  config: StylesConfig = {};

  set start(p: Point) {
    this._start = p;
    if (this._end) this.process();
  }

  set end(p: Point) {
    this._end = p;
    if (this._start) this.process();
  }

  getBoundingRect(): {
    left: number;
    right: number;
    top: number;
    bottom: number;
  } {
    return this.rect;
  }

  isIntersects(point: Point) {
    const index =
      (point.y - this.rect.top) * this.width * 4 +
      (point.x - this.rect.left) * 4;
    return this.points.has(index);
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
    const x2 = this._end.x;

    const y1 = this._start.y;
    const y2 = this._end.y;

    const dx = Math.abs(x2 - x1);
    const sx = x1 < x2 ? 1 : -1;

    const dy = -Math.abs(y2 - y1);
    const sy = y1 < y2 ? 1 : -1;

    let x = x1;
    let y = y1;
    let e2;
    let er = dx + dy;

    this.points = new Map();

    if (width <= 0 || height <= 0) return;

    // const start = performance.now();
    while (true) {
      if (x === x2 && y === y2) break;
      const index = (y - top) * width * 4 + (x - left) * 4;
      this.points.set(index, { x: x - left, y: y - top });
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
    // console.log(`Calculated in: ${performance.now() - start}ms`);
  }

  draw(layer: Layer, drawer: Drawer) {
    // const start = performance.now();
    drawer.putImageData(layer, this.points, this.rect.left, this.rect.top);
    // console.log(`It took ${performance.now() - start}ms`);
  }

  getId(): string {
    return Date.now() + "";
  }
}
