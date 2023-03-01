import { ITool } from '../interfaces/ITool';
import { addScratch, moveScratch, changeScratch, Manager, Point } from '../';
import { throttle } from '../utils/throttle';
import { BaseCreationalTool } from './BaseCreationalTool';

export class PenTool extends BaseCreationalTool implements ITool {
  private touchId?: number;

  private lastTouchTS = 0;

  constructor(manager: Manager) {
    super(manager);
    this.mouseDown = this.mouseDown.bind(this);
    this.mouseUp = this.mouseUp.bind(this);
    this.mouseMove = this.mouseMove.bind(this);
    this.touchStart = this.touchStart.bind(this);
    this.touchEnd = this.touchEnd.bind(this);
    this.touchMove = this.touchMove.bind(this);
    this.addPoint = throttle(this.addPoint.bind(this), 10);
  }

  private startScratch(p: Point) {
    this.start();
    this.manager.actions.dispatch(
      addScratch(this.id!, {
        ...this.getDefaultCreateOptions(),
        ...this.getPoint(p),
      })
    );
  }

  private finishScratch(p: Point) {
    const layerId = this.manager.layers!.active;
    if (this.active && layerId && this.id) {
      this.manager.actions.dispatch(
        moveScratch(this.id, { layerId, ...this.getPoint(p) })
      );
    }
    this.end();
  }

  private addPoint(p: Point) {
    if (!this.active || !this.id) return;
    this.manager.actions.dispatch(changeScratch(this.id, this.getPoint(p)));
  }

  private getPoint(p: Point) {
    const offsetX = this.manager.rect.left - this.manager.offset.x;
    const offsetY = this.manager.rect.top - this.manager.offset.y;
    return {
      point: {
        x: p.x + offsetX,
        y: p.y + offsetY,
      },
    };
  }

  private touchStart(e: TouchEvent) {
    e.preventDefault();
    this.lastTouchTS = e.timeStamp;
    if (this.touchId !== undefined) return;

    this.touchId = e.changedTouches[0].identifier;
    this.startScratch({
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY,
    });
  }

  private touchEnd(e: TouchEvent) {
    e.preventDefault();
    this.lastTouchTS = e.timeStamp;
    if (this.touchId === undefined) return;

    const index = Array.from(e.changedTouches).findIndex(
      (t) => t.identifier === this.touchId
    );
    if (index === -1) return;

    this.touchId = undefined;
    this.finishScratch({
      x: e.changedTouches[index].clientX,
      y: e.changedTouches[index].clientY,
    });
  }

  private touchMove(e: TouchEvent) {
    e.preventDefault();
    this.lastTouchTS = e.timeStamp;

    if (this.touchId === undefined) return;

    const index = Array.from(e.changedTouches).findIndex(
      (t) => t.identifier === this.touchId
    );
    if (index === -1) return;

    this.addPoint({
      x: e.changedTouches[index].clientX,
      y: e.changedTouches[index].clientY,
    });
  }

  private mouseDown(e: MouseEvent) {
    if (e.timeStamp - this.lastTouchTS < 100) return;
    this.startScratch({
      x: e.clientX,
      y: e.clientY,
    });
  }

  private mouseUp(e: MouseEvent) {
    if (e.timeStamp - this.lastTouchTS < 100) return;
    this.finishScratch({
      x: e.clientX,
      y: e.clientY,
    });
  }

  private mouseMove(e: MouseEvent) {
    if (e.timeStamp - this.lastTouchTS < 100) return;
    this.addPoint({
      x: e.clientX,
      y: e.clientY,
    });
  }

  protected disableListeners() {
    window.removeEventListener('mousedown', this.mouseDown);
    window.removeEventListener('mouseup', this.mouseUp);
    window.removeEventListener('mousemove', this.mouseMove);
    window.removeEventListener('touchstart', this.touchStart);
    window.removeEventListener('touchend', this.touchEnd);
    window.removeEventListener('touchmove', this.touchMove);
  }

  protected applyListeners() {
    window.addEventListener('touchstart', this.touchStart);
    window.addEventListener('touchend', this.touchEnd);
    window.addEventListener('touchmove', this.touchMove);
    window.addEventListener('mousedown', this.mouseDown);
    window.addEventListener('mouseup', this.mouseUp);
    window.addEventListener('mousemove', this.mouseMove);
  }
}
