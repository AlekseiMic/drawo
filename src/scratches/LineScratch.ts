import { Drawer, StylesConfig } from "../Drawer";
import { IScratch } from "../interfaces/IScratch";
import { Point } from "../interfaces/Point";
import { Layer } from "../Layer";

export class LineScratch implements IScratch {
  _start: Point = { x: 0, y: 0 };

  _end: Point = { x: 0, y: 0 };

  offset: Point = { x: 0, y: 0 };

  width: Number = 0;

  height: Number = 0;

  config: StylesConfig = {};

  set start(p: Point) {
    this._start = p;
    if (this._end) this.calcMeta();
  }

  set end(p: Point) {
    this._end = p;
    if (this._start) this.calcMeta();
  }

  calcMeta() {
    const offsetX = Math.min(this._start.x, this._end.x);
    const offsetY = Math.min(this._start.y, this._end.y);
    const width = Math.max(this._start.x, this._end.x) - offsetX;
    const height = Math.max(this._start.y, this._end.y) - offsetY;
    this.width = width;
    this.height = height;
    this.offset = { x: offsetX, y: offsetY };
  }

  draw(layer: Layer, drawer: Drawer) {
    drawer.drawLine(layer, this._start, this._end, this.config);
  }

  getId(): string {
    return Date.now() + "";
  }
}
