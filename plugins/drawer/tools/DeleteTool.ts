/* eslint-disable class-methods-use-this */
import { IScratch, ScratchState } from '../interfaces/IScratch';
import { ITool } from '../interfaces/ITool';
import { Point } from '../interfaces/Point';
import { hoverScratch, Manager, removeScratch, unhoverScratch } from '../';
import { throttle } from '../utils/throttle';
import { BaseTool } from './BaseTool';

let lastTouchEventTS = 0;

export class DeleteTool extends BaseTool implements ITool {
  private hovered: IScratch | null = null;

  constructor(manager: Manager) {
    super(manager);
    this.mouseMove = throttle(this.mouseMove.bind(this), 10);
    this.click = this.click.bind(this);
    this.touchStart = this.touchStart.bind(this);
  }

  disable(): void {
    document.body.style.cursor = 'auto';
    super.disable();
  }

  private touchStart(event: TouchEvent) {
    event.preventDefault();
    lastTouchEventTS = event.timeStamp;

    if (!event.changedTouches[0]) return;

    const point = this.preparePoint({
      x: event.changedTouches[0].clientX,
      y: event.changedTouches[0].clientY,
    });

    const hovered = this.getHoveredScratchInActiveLayer(point);
    if (hovered) this.removeScratch(hovered);
  }

  private touchEnd(event: TouchEvent) {
    event.preventDefault();
    lastTouchEventTS = event.timeStamp;
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

  private isHovers(s: IScratch, p: Point) {
    if (s.state === ScratchState.hidden) return false;
    const rect = s.rect;
    const region = 10;
    if (rect.left - region >= p.x || rect.right + region <= p.x) return false;
    if (rect.top - region >= p.y || rect.bottom + region <= p.y) return false;
    return s.isIntersects(p, region);
  }

  private mouseMove(event: MouseEvent) {
    if (event.timeStamp - lastTouchEventTS <= 100) return;
    if (!this.manager.layers!.active) return;

    const p = this.preparePoint({ x: event.clientX, y: event.clientY });

    if (this.hovered && this.isHovers(this.hovered, p)) return;
    if (this.hovered) this.unhover();

    const hovered = this.getHoveredScratchInActiveLayer(p);
    if (hovered) this.hover(hovered);
  }

  private preparePoint(point: Point): Point {
    return {
      x: point.x + this.manager.rect.left - this.manager.offset.x,
      y: point.y + this.manager.rect.top - this.manager.offset.y,
    };
  }

  private getHoveredScratchInActiveLayer(point: Point) {
    const layer = this.manager.layers!.getActive();

    if (layer) {
      for (const id of this.manager.layers.getScratches(layer.id)) {
        const s = this.manager.scratches.get(id);
        if (s && this.isHovers(s, point)) return s;
      }
    }
    return null;
  }

  private click(event: MouseEvent) {
    if (event.timeStamp - lastTouchEventTS <= 100) return;
    if (!this.hovered) return;
    this.removeScratch(this.hovered);
    this.unhover();
  }

  private removeScratch(scratch: IScratch) {
    const layer = this.manager.layers.active;
    if (!layer) return;
    this.manager.actions.dispatch(removeScratch(scratch.id, {}, layer));
  }

  protected applyListeners(): void {
    window.addEventListener('click', this.click);
    window.addEventListener('mousemove', this.mouseMove);
    window.addEventListener('touchstart', this.touchStart);
    window.addEventListener('touchend', this.touchEnd);
  }

  protected disableListeners(): void {
    window.removeEventListener('click', this.click);
    window.removeEventListener('mousemove', this.mouseMove);
    window.removeEventListener('touchstart', this.touchStart);
    window.removeEventListener('touchend', this.touchEnd);
  }
}
