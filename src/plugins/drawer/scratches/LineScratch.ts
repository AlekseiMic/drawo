import { Drawer } from "../";
import { IScratch } from "../interfaces/IScratch";
import { Point } from "../interfaces/Point";
import { Pointable } from "../interfaces/Pointable";
import { Rect } from "../interfaces/Rect";
import { distanceToLine, line } from "../utils/line";
import { BaseScratch } from "./BaseScratch";

export class LineScratch extends BaseScratch implements IScratch, Pointable {
  points: Uint32Array = new Uint32Array();

  private _start: Point = { x: 0, y: 0 };

  private _end: Point = { x: 0, y: 0 };

  private _rStart: Point = { x: 0, y: 0 };

  private _rEnd: Point = { x: 0, y: 0 };

  set start(p: undefined | Point) {
    if (!p) return;
    if (this._start.x !== p.x || this._start.y !== p.y) {
      this.isReady = false;
      this._start = p;
    }
  }

  set end(p: undefined | Point) {
    if (!p) return;
    if (this._end.x !== p.x || this._end.y !== p.y) {
      this.isReady = false;
      this._end = p;
    }
  }

  static create(id: string, user: string, data: any) {
    const line = new LineScratch(user, id);
    line.change(data);
    return line;
  }

  change(data: any): void {
    this.start = data.start;
    this.end = data.end;
    this.state = data.state;
    this.color = data.color;
    this.thickness = data.thickness ?? this.thickness;
  }

  updateRect() {
    this._rect = {
      left: Math.min(
        this._start.x - this.thickness,
        this._end.x - this.thickness
      ),
      top: Math.min(
        this._start.y - this.thickness,
        this._end.y - this.thickness
      ),
      right: Math.max(
        this._start.x + 2 * this.thickness,
        this._end.x + 2 * this.thickness
      ),
      bottom: Math.max(
        this._start.y + 2 * this.thickness,
        this._end.y + 2 * this.thickness
      ),
    };

    this._rStart = {
      x: this._start.x - this._rect.left,
      y: this._start.y - this._rect.top,
    };

    this._rEnd = {
      x: this._end.x - this._rect.left,
      y: this._end.y - this._rect.top,
    };

    this.width = this._rect.right - this._rect.left + 1;
    this.height = this._rect.bottom - this._rect.top + 1;
  }

  isIntersects(point: Point, region = 1) {
    return (
      distanceToLine(
        {
          x: this._rStart.x + this.rect.left,
          y: this._rStart.y + this.rect.top,
        },
        {
          x: this._rEnd.x + this.rect.left,
          y: this._rEnd.y + this.rect.top,
        },
        point
      ) <= region
    );
  }

  process() {
    this.isReady = true;
    this.updateRect();
    if (this.width <= 0 || this.height <= 0) return;
    this.points = new Uint32Array(
      line(this._rStart, this._rEnd, this.thickness)
    );
  }

  draw(data: ImageData, drawer: Drawer, rect?: Rect) {
    this.prepare();
    drawer.drawPixels(data, this, rect);
  }
}
