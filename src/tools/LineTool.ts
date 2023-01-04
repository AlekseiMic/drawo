import { nanoid } from "nanoid";
import { ITool } from "../interfaces/ITool";
import { Point } from "../interfaces/Point";
import { Manager } from "../Manager";

export class LineTool implements ITool {
  private active: boolean = false;

  private activated: boolean = false;

  private start: Point | undefined;

  private end: Point | undefined;

  private id: string | undefined;

  constructor(private manager: Manager) {
    this.mouseupListener = this.mouseupListener.bind(this);
    this.mousedownListener = this.mousedownListener.bind(this);
    this.mousemoveListener = this.mousemoveListener.bind(this);
  }

  activate(): void {
    if (this.activated) return;

    this.activated = true;
    this.applyListeners();
  }

  disable(): void {
    if (!this.activated) return;

    this.activated = false;
    this.disableListeners();
  }

  private mousedownListener(e: MouseEvent) {
    const offsetX = this.manager.rect.left;
    const offsetY = this.manager.rect.top;
    this.start = { x: e.x + offsetX, y: e.y + offsetY };
    this.end = { x: e.x + offsetX, y: e.y + offsetY };
    this.id = nanoid();
    this.active = true;
    this.manager.dispatch({
      type: "addScratch",
      payload: {
        layoutId: "preview",
        scratch: "Line",
        id: this.id,
        data: {
          start: this.start,
          end: this.end,
        },
      },
    });
  }

  private mouseupListener(e: MouseEvent) {
    const layer = this.manager.activeLayer;
    if (!layer || !this.active) return;
    this.active = false;

    const offsetX = this.manager.rect.left;
    const offsetY = this.manager.rect.top;
    this.end = { x: e.x + offsetX, y: e.y + offsetY };
    this.manager.dispatch({
      type: "moveScratch",
      payload: {
        fromLayer: "preview",
        toLayer: layer.id,
        id: this.id,
        scratch: "Line",
        data: {
          start: this.start,
          end: this.end,
        },
      },
    });
  }

  private mousemoveListener(e: MouseEvent) {
    if (!this.active) return;
    const offsetX = this.manager.rect.left;
    const offsetY = this.manager.rect.top;
    this.end = { x: e.x + offsetX, y: e.y + offsetY };
    this.manager.dispatch({
      type: "changeScratch",
      payload: {
        layerId: "preview",
        id: this.id,
        scratch: "Line",
        data: {
          start: this.start,
          end: this.end,
        },
      },
    });
  }

  private disableListeners() {
    window.removeEventListener("mousedown", this.mousedownListener);
    window.removeEventListener("mouseup", this.mouseupListener);
    window.removeEventListener("mousemove", this.mousemoveListener);
  }

  private applyListeners() {
    window.addEventListener("mousedown", this.mousedownListener);
    window.addEventListener("mouseup", this.mouseupListener);
    window.addEventListener("mousemove", this.mousemoveListener);
  }
}
