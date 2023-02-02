import { ITool } from '../interfaces/ITool';
import { Point } from '../interfaces/Point';
import { addScratch, changeScratch, Manager, moveScratch } from '../';
import { BaseCreationalTool } from './BaseCreationalTool';

export class LineTool extends BaseCreationalTool implements ITool {
  private startPoint: Point | undefined;

  private endPoint: Point | undefined;

  constructor(manager: Manager) {
    super(manager);

    this.mouseupListener = this.mouseupListener.bind(this);
    this.mousedownListener = this.mousedownListener.bind(this);
    this.mousemoveListener = this.mousemoveListener.bind(this);
  }

  private mousedownListener(e: MouseEvent) {
    this.start();
    this.update(e, 'startPoint');
    this.update(e, 'endPoint');
    this.manager.actions.dispatch(
      addScratch(this.id!, {
        ...this.getDefaultCreateOptions(),
        ...this.getPoints(),
      })
    );
  }

  private mouseupListener(e: MouseEvent) {
    const layerId = this.manager.layers!.active;
    if (layerId && this.active && this.id) {
      this.update(e, 'endPoint');
      this.manager.actions.dispatch(
        moveScratch(this.id, { layerId, ...this.getPoints() })
      );
    }
    this.end();
  }

  private mousemoveListener(e: MouseEvent) {
    if (!this.active || !this.id) return;
    this.update(e, 'endPoint');
    this.manager.actions.dispatch(changeScratch(this.id, this.getPoints()));
  }

  private getPoints() {
    return {
      start: this.startPoint,
      end: this.endPoint,
    };
  }

  private update(e: MouseEvent, point: 'endPoint' | 'startPoint' = 'endPoint') {
    const offsetX = this.manager.rect.left - this.manager.offset.x;
    const offsetY = this.manager.rect.top - this.manager.offset.y;
    this[point] = { x: e.x + offsetX, y: e.y + offsetY };
  }

  protected disableListeners() {
    window.removeEventListener('mousedown', this.mousedownListener);
    window.removeEventListener('mouseup', this.mouseupListener);
    window.removeEventListener('mousemove', this.mousemoveListener);
  }

  protected applyListeners() {
    window.addEventListener('mousedown', this.mousedownListener);
    window.addEventListener('mouseup', this.mouseupListener);
    window.addEventListener('mousemove', this.mousemoveListener);
  }
}
