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
import { throttle } from '../utils/throttle';
import { BaseTool } from './BaseTool';

export class MoveTool extends BaseTool implements ITool {
  private hovered: IScratch | null = null;

  private dragged: IScratch | null = null;

  private canvasDrag = false;

  private start: Point = { x: 0, y: 0 };

  constructor(manager: Manager) {
    super(manager);
    this.mouseMove = throttle(this.mouseMove.bind(this), 10);
    this.mouseDown = this.mouseDown.bind(this);
    this.mouseUp = this.mouseUp.bind(this);

    this.touchMove = throttle(this.mouseMove.bind(this), 10);
    this.touchStart = this.touchStart.bind(this);
    this.touchEnd = this.touchEnd.bind(this);
  }

  disable(): void {
    document.body.style.cursor = 'auto';
    super.disable();
  }

  private hover(s: IScratch) {
    document.body.style.cursor = 'grab';
    this.hovered = s;
    this.manager.actions.dispatch(
      hoverScratch(s.id, {}, this.manager.layers!.active!)
    );
  }

  private unhover() {
    if (!this.hovered) return;
    const s = this.hovered;
    document.body.style.cursor = 'auto';
    this.hovered = null;
    this.manager.actions.dispatch(
      unhoverScratch(s.id, {}, this.manager.layers!.active!)
    );
  }

  private drag(s: IScratch) {
    this.dragged = s;
    this.manager.actions.dispatch(
      dragScratch(s.id, {}, this.manager.layers.active!)
    );
  }

  private drop() {
    if (!this.dragged) return;
    const s = this.dragged;
    this.dragged = null;
    this.manager.actions.dispatch(
      dropScratch(s.id, {}, this.manager.layers.active!)
    );
  }

  private isHovers(s: IScratch, p: Point) {
    if (s.state === ScratchState.hidden) return false;
    const rect = s.rect;
    const region = 10;
    if (rect.left - region >= p.x || rect.right + region <= p.x) return false;
    if (rect.top - region >= p.y || rect.bottom + region <= p.y) return false;
    return s.isIntersects(p, region);
  }

  private touchStart(e: TouchEvent) {
    document.body.style.cursor = 'grabbing';
    this.start = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    if (!this.hovered) {
      this.checkHover({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
    if (!this.hovered) {
      this.canvasDrag = true;
      return;
    }
    const layer = this.manager.layers!.active;
    if (!layer) return;
    this.drag(this.hovered);
  }

  private mouseDown(event: MouseEvent) {
    document.body.style.cursor = 'grabbing';
    this.start = { x: event.x, y: event.y };
    if (!this.hovered) {
      this.canvasDrag = true;
      return;
    }
    const layer = this.manager.layers!.active;
    if (!layer) return;
    this.drag(this.hovered);
  }

  private touchEnd(event: TouchEvent) {
    document.body.style.cursor = 'grab';
    if (!this.dragged) {
      this.canvasDrag = false;
      return;
    }
    const s = this.dragged;
    const point = {
      x:
        event.touches[0].clientX +
        this.manager.rect.left -
        this.manager.offset.x,
      y:
        event.touches[0].clientY +
        this.manager.rect.top -
        this.manager.offset.y,
    };
    this.drop();
    if (!this.isHovers(s, point)) this.unhover();
  }

  private mouseUp(event: MouseEvent) {
    document.body.style.cursor = 'grab';
    if (!this.dragged) {
      this.canvasDrag = false;
      return;
    }
    const s = this.dragged;
    const point = {
      x: event.x + this.manager.rect.left - this.manager.offset.x,
      y: event.y + this.manager.rect.top - this.manager.offset.y,
    };
    this.drop();
    if (!this.isHovers(s, point)) this.unhover();
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
    const observer = this.manager.users.active;
    if (!observer) return;
    this.manager.actions.dispatch(
      moveObserver(observer, this.getCoordChange(point))
    );
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

  private checkHover(point: Point) {
    if (!this.manager.layers!.active) return;
    if (this.dragged) return this.dragMove(point);
    if (this.canvasDrag) return this.dragCanvas(point);

    const p = {
      x: point.x + this.manager.rect.left - this.manager.offset.x,
      y: point.y + this.manager.rect.top - this.manager.offset.y,
    };

    if (this.hovered && this.isHovers(this.hovered, p)) return;
    if (this.hovered) this.unhover();

    const layer = this.manager.layers!.getActive();
    const activeScratchesIds = layer
      ? this.manager.layers.getScratches(layer.id)
      : [];
    for (const id of activeScratchesIds) {
      const s = this.manager.scratches.get(id);
      if (!s || !this.isHovers(s, p)) continue;
      this.hover(s);
      break;
    }
  }

  private touchMove(event: TouchEvent) {
    this.checkHover({
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    });
  }

  private mouseMove(event: MouseEvent) {
    this.checkHover({
      x: event.clientX,
      y: event.clientY,
    });
  }

  protected applyListeners(): void {
    window.addEventListener('mousemove', this.mouseMove);
    window.addEventListener('mousedown', this.mouseDown);
    window.addEventListener('mouseup', this.mouseUp);
    window.addEventListener('touchmove', this.touchMove);
    window.addEventListener('touchstart', this.touchStart);
    window.addEventListener('touchend', this.touchEnd);
  }

  protected disableListeners(): void {
    window.removeEventListener('mousemove', this.mouseMove);
    window.removeEventListener('mousedown', this.mouseDown);
    window.removeEventListener('mouseup', this.mouseUp);
    window.removeEventListener('touchmove', this.touchMove);
    window.removeEventListener('touchstart', this.touchStart);
    window.removeEventListener('touchend', this.touchEnd);
  }
}
