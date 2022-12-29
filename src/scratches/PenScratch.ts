import { Drawer } from "../Drawer";
import { Color } from "../interfaces/Color";
import { IScratch, ScratchState } from "../interfaces/IScratch";
import { Point } from "../interfaces/Point";
import { Pointable } from "../interfaces/Pointable";
import { distanceToLine, line } from "../utils/line";

export class PenScratch implements IScratch, Pointable {
  private _id: string;

  private _points: Point[] = [];

  private _rPoints: Point[] = [];

  state = ScratchState.active;

  points: Uint32Array = new Uint32Array();

  _rect: { left: number; right: number; top: number; bottom: number } = {
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  };

  width: number = 0;

  height: number = 0;

  color: Color = { r: 155, g: 200, b: 0, a: 154 };

  get rect() {
    return this._rect;
  }

  get id(): string {
    return this._id;
  }

  constructor() {
    this._id = Date.now() + "";
  }

  updateRect() {
    let left = 0,
      right = 0,
      top = 0,
      bottom = 0;
    this._points.forEach((p) => {
      if (left === 0 || p.x < left) left = p.x;
      if (p.x > right) right = p.x;
      if (top === 0 || p.y < top) top = p.y;
      if (p.y > bottom) bottom = p.y;
    });
    this.width = right - left;
    this.height = bottom - top;
    this._rect = { left, top, bottom, right };
    this._rPoints = this._points.map((p) => {
      return {
        x: p.x - left,
        y: p.y - top,
      };
    });
  }

  process() {
    if (this._points.length < 2) return;
    this.updateRect();
    const result = [];
    let prev = null;
    for (const p1 of this._points) {
      if (prev) {
        result.push(...line(prev, p1, { x: this.rect.left, y: this.rect.top }));
      }
      prev = p1;
    }
    this.points = new Uint32Array(result);
  }

  addPoint(point: Point) {
    this._points.push(point);
    this.process();
  }

  move(p: Point): void {
    this._rect = {
      left: this._rect.left + p.x,
      top: this._rect.top + p.y,
      right: this._rect.left + p.x + this.width,
      bottom: this._rect.top + p.y + this.height,
    };
  }

  draw(data: ImageData, drawer: Drawer) {
    drawer.putImageData(data, this);
  }

  isIntersects(point: Point, region = 1): boolean {
    let prev = null;
    for (const p1 of this._rPoints) {
      const left = Math.min(p1.x, prev?.x ?? 0) + this.rect.left;
      const top = Math.min(p1.y, prev?.y ?? 0) + this.rect.top;
      const bottom = Math.max(p1.y, prev?.y ?? 0) + this.rect.top;
      const right = Math.max(p1.x, prev?.x ?? 0) + this.rect.left;
      if (
        prev &&
        (left - region <= point.x || left + region <= point.x) &&
        (right - region >= point.x || right + region >= point.x) &&
        (top - region <= point.y || top + region <= point.y) &&
        (bottom - region >= point.y || bottom + region >= point.y) &&
        distanceToLine(
          { x: prev.x + this.rect.left, y: prev.y + this.rect.top },
          { x: p1.x + this.rect.left, y: p1.y + this.rect.top },
          point
        ) <= region
      )
        return true;
      prev = p1;
    }
    return false;
  }
}
