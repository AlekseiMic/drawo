import { DrawService } from '../';
import { RGBA } from '../interfaces/Color';
import { IScratch, ScratchState } from '../interfaces/IScratch';
import { Point } from '../interfaces/Point';
import { Rect } from '../interfaces/Rect';

export abstract class BaseScratch implements IScratch {
  id: string;

  user: string;

  thickness: number = 1;

  isReady: boolean = false;

  width: number = 0;

  height: number = 0;

  protected _state: ScratchState = ScratchState.active;

  protected _color: RGBA | undefined;

  protected _rect: Rect = { left: 0, top: 0, right: 0, bottom: 0 };

  abstract isIntersects(point: Point, region?: number | undefined): boolean;

  abstract process(): void;

  abstract change(data: any): void;

  abstract serialize(): any;

  abstract draw(
    data: ImageData,
    drawer: DrawService,
    rect?: Rect | undefined
  ): void;

  set state(s: ScratchState) {
    if (!s) return;
    if (s !== this.state) {
      this._state = s;
    }
  }

  set color(c: undefined | RGBA) {
    if (!c) return;
    this._color = c;
  }

  get color() {
    return this._color;
  }

  get state() {
    return this._state;
  }

  get rect() {
    this.prepare();
    return this._rect;
  }

  constructor(user: string, id: string) {
    this.user = user;
    this.id = id;
  }

  prepare(): void {
    if (this.isReady) return;
    this.process();
  }

  isIntersectsRect(rect: Rect): boolean {
    return !(
      this.rect.top >= rect.bottom ||
      this.rect.bottom <= rect.top ||
      this.rect.left >= rect.right ||
      this.rect.right <= rect.left
    );
  }

  move(p: Point): void {
    this._rect = {
      left: this._rect.left + p.x,
      top: this._rect.top + p.y,
      right: this._rect.left + p.x + this.width,
      bottom: this._rect.top + p.y + this.height,
    };
  }
}
