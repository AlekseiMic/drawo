/* eslint-disable class-methods-use-this */
import { IScratch, ScratchState } from '../interfaces/IScratch';
import { ITool } from '../interfaces/ITool';
import { Point } from '../interfaces/Point';
import { hoverScratch, Manager, removeScratch, unhoverScratch } from '../';
import { throttle } from '../utils/throttle';
import { BaseTool } from './BaseTool';

export class DeleteTool extends BaseTool implements ITool {
  private hovered: IScratch | null = null;

  constructor(manager: Manager) {
    super(manager);
    this.mouseMove = throttle(this.mouseMove.bind(this), 10);
    this.click = this.click.bind(this);
  }

  disable(): void {
    document.body.style.cursor = 'auto';
    super.disable();
  }

  private hover(s: IScratch) {
    document.body.style.cursor = 'grab';
    this.hovered = s;
    this.manager.dispatch(hoverScratch(s.id, {}, this.manager.layers!.active!));
  }

  private unhover() {
    if (!this.hovered) return;
    const s = this.hovered;
    document.body.style.cursor = 'auto';
    this.hovered = null;
    this.manager.dispatch(
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
    if (!this.manager.layers!.active) return;

    const p = {
      x: event.x + this.manager.rect.left - this.manager.offset.x,
      y: event.y + this.manager.rect.top - this.manager.offset.y,
    };

    if (this.hovered && this.isHovers(this.hovered, p)) return;
    if (this.hovered) this.unhover();

    const layer = this.manager.layers!.getActive();
    const activeScratchesIds = layer?.scratches ?? [];
    for (const id of activeScratchesIds) {
      const s = layer?.getScratch(id);
      if (!s || !this.isHovers(s, p)) continue;
      this.hover(s);
      break;
    }
  }

  private click() {
    if (!this.hovered) return;
    const s = this.hovered;
    this.unhover();
    this.manager.dispatch(removeScratch(s.id, {}, this.manager.layers.active!));
  }

  protected applyListeners(): void {
    window.addEventListener('click', this.click);
    window.addEventListener('mousemove', this.mouseMove);
  }

  protected disableListeners(): void {
    window.removeEventListener('click', this.click);
    window.removeEventListener('mousemove', this.mouseMove);
  }
}
