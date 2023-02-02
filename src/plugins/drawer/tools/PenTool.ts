import { ITool } from '../interfaces/ITool';
import { addScratch, moveScratch, changeScratch, Manager } from '../';
import { throttle } from '../utils/throttle';
import { BaseCreationalTool } from './BaseCreationalTool';

export class PenTool extends BaseCreationalTool implements ITool {
  constructor(manager: Manager) {
    super(manager);
    this.finishScratch = this.finishScratch.bind(this);
    this.startScratch = this.startScratch.bind(this);
    this.addPoint = throttle(this.addPoint.bind(this), 10);
  }

  private startScratch(e: MouseEvent) {
    this.start();
    this.manager.actions.dispatch(
      addScratch(this.id!, {
        ...this.getDefaultCreateOptions(),
        ...this.getPoint(e),
      })
    );
  }

  private finishScratch(e: MouseEvent) {
    const layerId = this.manager.layers!.active;
    if (this.active && layerId && this.id) {
      this.manager.actions.dispatch(
        moveScratch(this.id, { layerId, ...this.getPoint(e) })
      );
    }
    this.end();
  }

  private addPoint(e: MouseEvent) {
    if (!this.active || !this.id) return;
    this.manager.actions.dispatch(changeScratch(this.id, this.getPoint(e)));
  }

  private getPoint(e: MouseEvent) {
    const offsetX = this.manager.rect.left - this.manager.offset.x;
    const offsetY = this.manager.rect.top - this.manager.offset.y;
    return {
      point: {
        x: e.x + offsetX,
        y: e.y + offsetY,
      },
    };
  }

  protected disableListeners() {
    window.removeEventListener('mousedown', this.startScratch);
    window.removeEventListener('mouseup', this.finishScratch);
    window.removeEventListener('mousemove', this.addPoint);
  }

  protected applyListeners() {
    window.addEventListener('mousedown', this.startScratch);
    window.addEventListener('mouseup', this.finishScratch);
    window.addEventListener('mousemove', this.addPoint);
  }
}
