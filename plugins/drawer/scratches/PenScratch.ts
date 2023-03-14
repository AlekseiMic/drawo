import { DrawService } from '../';
import { IScratch } from '../interfaces/IScratch';
import { Point } from '../interfaces/Point';
import { Pointable } from '../interfaces/Pointable';
import { Rect } from '../interfaces/Rect';
import { distanceToLine, line } from '../utils/line';
import { BaseScratch } from './BaseScratch';

export class PenScratch extends BaseScratch implements IScratch, Pointable {
  points: Uint32Array = new Uint32Array();

  private _points: Point[] = [];

  private _rPoints: Point[] = [];

  change(data: any): void {
    this.state = data.state ?? this.state;
    this.color = data.color;
    this.thickness = data.thickness ?? this.thickness;
    if (data.point) this.addPoint(data.point);
    if (data.points) {
      this._points = data.points;
      this._rPoints = [];
      this.isReady = false;
    }
  }

  static create(id: string, user: string, data: any) {
    const line = new PenScratch(user, id);
    line.change(data);
    return line;
  }

  getName() {
    return 'PenScratch';
  }

  serialize() {
    return {
      name: this.getName(),
      id: this.id,
      user: this.user,
      payload: {
        color: this.color,
        state: this.state,
        thickness: this.thickness,
        points: this._points,
      },
    };
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

    this._rect = {
      left: left - this.thickness,
      top: top - this.thickness,
      bottom: bottom + this.thickness,
      right: right + this.thickness,
    };

    this.width = this._rect.right - this._rect.left;
    this.height = this._rect.bottom - this._rect.top;

    this._rPoints = this._points.map((p) => {
      return { x: p.x - this._rect.left, y: p.y - this._rect.top };
    });
  }

  process() {
    if (this._points.length < 2) return;
    this.isReady = true;
    this.updateRect();
    const result = [];
    let prev = null;
    for (const p1 of this._rPoints) {
      if (prev) {
        result.push(...line(prev, p1, this.thickness));
      }
      prev = p1;
    }
    this.points = new Uint32Array(result);
  }

  addPoint(point: Point) {
    this._points.push(point);
    this.isReady = false;
  }

  draw(data: ImageData, drawer: DrawService, rect: Rect) {
    this.prepare();
    drawer.draw(data, this, rect);
  }

  isIntersects(point: Point, region = 1): boolean {
    let prev = null;
    const rect = this.rect;
    for (const p1 of this._rPoints) {
      const left = Math.min(p1.x, prev?.x ?? 0) + rect.left;
      const top = Math.min(p1.y, prev?.y ?? 0) + rect.top;
      const bottom = Math.max(p1.y, prev?.y ?? 0) + rect.top;
      const right = Math.max(p1.x, prev?.x ?? 0) + rect.left;
      if (
        prev &&
        (left - region <= point.x || left + region <= point.x) &&
        (right - region >= point.x || right + region >= point.x) &&
        (top - region <= point.y || top + region <= point.y) &&
        (bottom - region >= point.y || bottom + region >= point.y) &&
        distanceToLine(
          { x: prev.x + rect.left, y: prev.y + rect.top },
          { x: p1.x + rect.left, y: p1.y + rect.top },
          point
        ) <= region
      )
        return true;
      prev = p1;
    }
    return false;
  }
}
