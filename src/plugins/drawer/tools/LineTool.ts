import { nanoid } from 'nanoid';
import { Action } from '../interfaces/Action';
import { ScratchState } from '../interfaces/IScratch';
import { ITool } from '../interfaces/ITool';
import { Point } from '../interfaces/Point';
import { Manager } from '../Manager';
import { LineScratch } from '../scratches/LineScratch';
import { BaseTool } from './BaseTool';

export class LineTool extends BaseTool implements ITool {
  private start: Point | undefined;

  private end: Point | undefined;

  private id: string | undefined;

  constructor(manager: Manager) {
    super(manager);

    this.mouseupListener = this.mouseupListener.bind(this);
    this.mousedownListener = this.mousedownListener.bind(this);
    this.mousemoveListener = this.mousemoveListener.bind(this);
  }

  create(a: Required<Action>) {
    return LineScratch.create(a.id, a.user, a.payload);
  }

  private mousedownListener(e: MouseEvent) {
    this.active = true;
    this.updateStartPoint(e);
    this.updateEndPoint(e);
    this.id = nanoid();

    this.manager.dispatch({
      type: 'addScratch',
      layerId: 'preview',
      id: this.id,
      payload: {
        tool: this.constructor.name,
        start: this.start,
        end: this.end,
        state: ScratchState.preview,
        color: this.manager.toolPanel!.color,
        thickness: this.manager.toolPanel!.thickness,
      },
    });
  }

  private mouseupListener() {
    const layer = this.manager.layers!.active;
    if (!layer || !this.active) return;
    this.active = false;

    this.manager.dispatch({
      type: 'moveScratch',
      layerId: 'preview',
      id: this.id,
      payload: {
        layerId: layer,
        state: ScratchState.active,
      },
    });

    this.id = undefined;
  }

  private mousemoveListener(e: MouseEvent) {
    if (!this.active) return;
    this.updateEndPoint(e);
    this.changeScratch();
  }

  private changeScratch() {
    this.manager.dispatch({
      type: 'changeScratch',
      layerId: 'preview',
      id: this.id,
      payload: {
        start: this.start,
        end: this.end,
      },
    });
  }

  private updateStartPoint(e: MouseEvent) {
    const offsetX = this.manager.rect.left - this.manager.offset.x;
    const offsetY = this.manager.rect.top - this.manager.offset.y;
    this.start = { x: e.x + offsetX, y: e.y + offsetY };
  }

  private updateEndPoint(e: MouseEvent) {
    const offsetX = this.manager.rect.left - this.manager.offset.x;
    const offsetY = this.manager.rect.top - this.manager.offset.y;
    this.end = { x: e.x + offsetX, y: e.y + offsetY };
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
