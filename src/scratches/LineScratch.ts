import { Drawer, StylesConfig } from "../Drawer";
import { IScratch } from "../interfaces/IScratch";
import { Point } from "../interfaces/Point";
import { Layer } from "../Layer";

export class LineScratch implements IScratch {
  _start: Point = { x: 0, y: 0 };

  _end: Point = { x: 0, y: 0 };

  points: Point[] = [];

  data: ImageData | undefined;

  offset: Point = { x: 0, y: 0 };

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
    return {
      left: this.offset.x,
      top: this.offset.y,
      right: this.offset.x + this.width,
      bottom: this.offset.y + this.height,
    };
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
    this.offset = { x: left, y: top };

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

    this.points = [];

    if (width <= 0 || height <= 0) return;
    // this.data = new Uint8ClampedArray(width * height * 4);
    this.data = new ImageData(width, height);
    // this.data.data.fill(0);

    // const start = performance.now();
    while (true) {
      if (x === x2 && y === y2) break;
      // this.points.push({ x, y });
      const index = (y - top) * width * 4 + (x - left) * 4;
      this.data.data[index] = 255;
      this.data.data[index + 1] = 255;
      this.data.data[index + 2] = 255;
      this.data.data[index + 3] = 200;
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
    const start = performance.now();
    // drawer.drawLine(layer, this._start, this._end, this.config);
    // this.points.forEach((p) => {
    //   drawer.drawPoint(layer, p);
    // });
    if (!this.data) return;
    drawer.putImageData(layer, this.data, this.offset.x, this.offset.y);
    console.log(`It took ${performance.now() - start}ms`);
  }

  getId(): string {
    return Date.now() + "";
  }
}
