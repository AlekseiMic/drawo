/* eslint-disable class-methods-use-this */
import { IScratch, ScratchState } from '../interfaces/IScratch';
import { ITool } from '../interfaces/ITool';
import { Point } from '../interfaces/Point';
import {
  dragScratch,
  dropScratch,
  hoverScratch,
  Manager,
  moveObserver,
  translateScratch,
  unhoverScratch,
} from '../';
import { BaseTool } from './BaseTool';

const RADIUS = 10;

export class MoveTool extends BaseTool implements ITool {
  private lastTouchTS = 0;

  private touchId?: number;

  private hovered: IScratch | null = null;

  private dragged: IScratch | null = null;

  private canvasDrag = false;

  private start: Point = { x: 0, y: 0 };

  constructor(manager: Manager) {
    super(manager);

    this.mouseMove = this.mouseMove.bind(this);
    this.mouseDown = this.mouseDown.bind(this);
    this.mouseUp = this.mouseUp.bind(this);

    this.touchMove = this.touchMove.bind(this);
    this.touchStart = this.touchStart.bind(this);
    this.touchEnd = this.touchEnd.bind(this);
  }

  disable(): void {
    document.body.style.cursor = 'auto';
    super.disable();
  }

  private hover(s: IScratch) {
    const layer = this.manager.layers!.active;
    if (!layer) return;

    this.manager.actions.dispatch(hoverScratch(s.id, {}, layer));
    this.hovered = s;

    document.body.style.cursor = 'grab';
  }

  private unhover() {
    const layer = this.manager.layers!.active;
    if (!layer || !this.hovered) return;

    this.manager.actions.dispatch(unhoverScratch(this.hovered.id, {}, layer));
    this.hovered = null;

    document.body.style.cursor = 'auto';
  }

  private drag(s: IScratch) {
    const layer = this.manager.layers.active;
    if (!layer) return;

    this.manager.actions.dispatch(dragScratch(s.id, {}, layer));
    this.dragged = s;
  }

  private drop() {
    const layer = this.manager.layers.active;
    if (!layer || !this.dragged) return;

    this.manager.actions.dispatch(dropScratch(this.dragged.id, {}, layer));
    this.dragged = null;
  }

  private dragMove(p: Point) {
    this.manager.actions.dispatch(
      translateScratch(this.dragged!.id, {
        move: this.getCoordChange(p),
      })
    );
    this.updateStartCoord(p);
  }

  private dragCanvas(point: Point) {
    const user = this.manager.users.active;
    if (!user) return;

    const pointDiff = this.getCoordChange(point);
    this.manager.actions.dispatch(moveObserver(user, pointDiff));
    this.updateStartCoord(point);
  }

  private getCoordChange(p: Point) {
    return {
      x: p.x - this.start.x,
      y: p.y - this.start.y,
    };
  }

  private updateStartCoord(p: Point) {
    this.start = { x: p.x, y: p.y };
  }

  private checkHover(rawPoint: Point) {
    if (!this.manager.layers!.active) return;
    if (this.dragged) return this.dragMove(rawPoint);
    if (this.canvasDrag) return this.dragCanvas(rawPoint);

    const point = this.preparePoint(rawPoint);

    if (this.hovered && this.isHovers(this.hovered, point)) return;
    if (this.hovered) this.unhover();

    const hovered = this.getHoveredScratchInActiveLayer(point);
    if (hovered) this.hover(hovered);
  }

  private isHovers(s: IScratch, p: Point) {
    if (s.state === ScratchState.hidden) return false;
    const rect = s.rect;

    if (rect.left - RADIUS >= p.x || rect.right + RADIUS <= p.x) return false;
    if (rect.top - RADIUS >= p.y || rect.bottom + RADIUS <= p.y) return false;

    return s.isIntersects(p, RADIUS);
  }

  private preparePoint(point: Point): Point {
    return {
      x: point.x + this.manager.rect.left - this.manager.offset.x,
      y: point.y + this.manager.rect.top - this.manager.offset.y,
    };
  }

  private getHoveredScratchInActiveLayer(point: Point) {
    const layer = this.manager.layers!.getActive();

    const activeScratchesIds = layer
      ? this.manager.layers.getScratches(layer.id)
      : [];

    for (const id of activeScratchesIds) {
      const s = this.manager.scratches.get(id);
      if (s && this.isHovers(s, point)) return s;
    }
    return null;
  }

  private mouseMove(event: MouseEvent) {
    if (event.timeStamp - this.lastTouchTS < 100) return;
    this.checkHover({
      x: event.clientX,
      y: event.clientY,
    });
  }

  private mouseDown(event: MouseEvent) {
    document.body.style.cursor = 'grabbing';
    if (event.timeStamp - this.lastTouchTS < 100) return;

    this.start = { x: event.x, y: event.y };

    if (this.hovered) this.drag(this.hovered);
    else this.canvasDrag = true;
  }

  private mouseUp(event: MouseEvent) {
    document.body.style.cursor = 'grab';
    if (event.timeStamp - this.lastTouchTS < 100) return;

    this.canvasDrag = false;
    if (!this.dragged) return;

    const point = this.preparePoint({
      x: event.x,
      y: event.y,
    });

    if (!this.isHovers(this.dragged, point)) {
      this.unhover();
    }
    this.drop();
  }

  private touchMove(event: TouchEvent) {
    event.preventDefault();
    this.lastTouchTS = event.timeStamp;

    if (this.touchId === undefined) return;

    const index = Array.from(event.changedTouches).findIndex(
      (t) => t.identifier === this.touchId
    );
    if (index === -1) return;

    const point = {
      x: event.changedTouches[index].clientX,
      y: event.changedTouches[index].clientY,
    };

    this.checkHover(point);
  }

  private touchEnd(event: TouchEvent) {
    event.preventDefault();
    this.lastTouchTS = event.timeStamp;

    if (this.touchId === undefined) return;

    const index = Array.from(event.changedTouches).findIndex(
      (t) => t.identifier === this.touchId
    );

    if (index === -1) return;

    document.body.style.cursor = 'grab';

    this.touchId = undefined;
    this.canvasDrag = false;
    this.drop();
  }

  private touchStart(event: TouchEvent) {
    event.preventDefault();
    this.lastTouchTS = event.timeStamp;

    if (this.touchId !== undefined) return;

    this.touchId = event.changedTouches[0].identifier;

    this.start = {
      x: event.changedTouches[0].clientX,
      y: event.changedTouches[0].clientY,
    };
    this.unhover();
    this.checkHover(this.start);

    document.body.style.cursor = 'grabbing';

    if (this.hovered) this.drag(this.hovered);
    else this.canvasDrag = true;
  }

  protected applyListeners(): void {
    window.addEventListener('mousemove', this.mouseMove);
    window.addEventListener('mousedown', this.mouseDown);
    window.addEventListener('mouseup', this.mouseUp);
    window.addEventListener('touchstart', this.touchStart);
    window.addEventListener('touchend', this.touchEnd);
    window.addEventListener('touchmove', this.touchMove);
  }

  protected disableListeners(): void {
    window.removeEventListener('mousemove', this.mouseMove);
    window.removeEventListener('mousedown', this.mouseDown);
    window.removeEventListener('mouseup', this.mouseUp);
    window.removeEventListener('touchstart', this.touchStart);
    window.removeEventListener('touchend', this.touchEnd);
    window.removeEventListener('touchmove', this.touchMove);
  }
}
