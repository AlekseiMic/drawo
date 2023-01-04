import { Drawer } from "../Drawer";
import { Color } from "../interfaces/Color";
import { IScratch, ScratchState } from "../interfaces/IScratch";
import { Point } from "../interfaces/Point";
import { Pointable } from "../interfaces/Pointable";
import { distanceToLine, line } from "../utils/line";

export class LineScratch implements IScratch, Pointable {
  private _id: string;

  private _start: Point = { x: 0, y: 0 };

  private _end: Point = { x: 0, y: 0 };

  private _rStart: Point = { x: 0, y: 0 };

  private _rEnd: Point = { x: 0, y: 0 };

  private thickness = 3;

  private _rect: { left: number; right: number; top: number; bottom: number } =
    {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    };

  state = ScratchState.active;

  points: Uint32Array = new Uint32Array();

  width: number = 0;

  height: number = 0;

  color: Color = { r: 155, g: 200, b: 0, a: 154 };

  set start(p: Point) {
    this._start = p;
    if (this._end) this.process();
  }

  set end(p: Point) {
    this._end = p;
    if (this._start) this.process();
  }

  get rect() {
    return this._rect;
  }

  get id(): string {
    return this._id;
  }

  constructor(public user: string) {
    this._id = Date.now() + "";
  }

  move(p: Point) {
    this._rect = {
      left: this._rect.left + p.x,
      top: this._rect.top + p.y,
      right: this._rect.left + p.x + this.width,
      bottom: this._rect.top + p.y + this.height,
    };
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
        this._start.x - this.thickness,
        this._end.x - this.thickness
      ),
      bottom: Math.max(
        this._start.y - this.thickness,
        this._end.y - this.thickness
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
    this.updateRect();
    if (this.width <= 0 || this.height <= 0) return;
    this.points = new Uint32Array(
      line(this._rStart, this._rEnd, this.thickness)
    );
  }

  draw(data: ImageData, drawer: Drawer) {
    drawer.putImageData(data, this);
  }
}
