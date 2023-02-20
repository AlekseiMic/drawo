import { ITool } from '../interfaces/ITool';
import { Point } from '../interfaces/Point';
import { addScratch, changeScratch, Manager, moveScratch, throttle } from '../';
import { BaseCreationalTool } from './BaseCreationalTool';

export class LineTool extends BaseCreationalTool implements ITool {
  private startPoint: Point | undefined;

  private endPoint: Point | undefined;

  constructor(manager: Manager) {
    super(manager);

    this.changeScratch = throttle(this.changeScratch.bind(this), 10);
    this.mouseUp = this.mouseUp.bind(this);
    this.mouseDown = this.mouseDown.bind(this);
    this.mouseMove = this.mouseMove.bind(this);
    this.touchStart = this.touchStart.bind(this);
    this.touchEnd = this.touchEnd.bind(this);
    this.touchMove = this.touchMove.bind(this);
  }

  private startScratch(p: Point) {
    this.start();
    this.update(p, 'startPoint');
    this.update(p, 'endPoint');
    this.manager.actions.dispatch(
      addScratch(this.id!, {
        ...this.getDefaultCreateOptions(),
        ...this.getPoints(),
      })
    );
  }

  private endScratch(p: Point) {
    const layerId = this.manager.layers!.active;
    if (layerId && this.active && this.id) {
      this.update(p, 'endPoint');
      this.manager.actions.dispatch(
        moveScratch(this.id, { layerId, ...this.getPoints() })
      );
    }
    this.end();
  }

  private changeScratch(p: Point) {
    if (!this.active || !this.id) return;
    this.update(p, 'endPoint');
    this.manager.actions.dispatch(changeScratch(this.id, this.getPoints()));
  }

  private getPoints() {
    return {
      start: this.startPoint,
      end: this.endPoint,
    };
  }

  private update(p: Point, prop: 'endPoint' | 'startPoint' = 'endPoint') {
    const offsetX = this.manager.rect.left - this.manager.offset.x;
    const offsetY = this.manager.rect.top - this.manager.offset.y;
    this[prop] = { x: p.x + offsetX, y: p.y + offsetY };
  }

  private mouseDown(e: MouseEvent) {
    this.startScratch({
      x: e.clientX,
      y: e.clientY,
    });
  }

  private mouseUp(e: MouseEvent) {
    this.endScratch({
      x: e.clientX,
      y: e.clientY,
    });
  }

  private mouseMove(e: MouseEvent) {
    this.changeScratch({
      x: e.clientX,
      y: e.clientY,
    });
  }

  private touchStart(e: TouchEvent) {
    this.startScratch({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    });
  }

  private touchEnd(e: TouchEvent) {
    this.endScratch({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    });
  }

  private touchMove(e: TouchEvent) {
    this.changeScratch({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
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
    window.addEventListener('mousedown', this.mouseDown);
    window.addEventListener('mouseup', this.mouseUp);
    window.addEventListener('mousemove', this.mouseMove);
    window.addEventListener('touchstart', this.touchStart);
    window.addEventListener('touchend', this.touchEnd);
    window.addEventListener('touchmove', this.touchMove);
  }
}
