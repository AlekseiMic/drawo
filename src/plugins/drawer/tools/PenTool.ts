import { nanoid } from "nanoid";
import { Action } from "../interfaces/Action";
import { ScratchState } from "../interfaces/IScratch";
import { ITool } from "../interfaces/ITool";
import { Manager } from "../Manager";
import { PenScratch } from "../scratches/PenScratch";
import { throttle } from "../utils/throttle";
import { BaseTool } from "./BaseTool";

export class PenTool extends BaseTool implements ITool {
  private id: string | undefined;

  constructor(manager: Manager) {
    super(manager);
    this.finishScratch = this.finishScratch.bind(this);
    this.startScratch = this.startScratch.bind(this);
    this.addPoint = throttle(this.addPoint.bind(this), 10);
  }

  create(a: Required<Action>) {
    return PenScratch.create(a.id, a.user, a.payload);
  }

  private startScratch(e: MouseEvent) {
    this.active = true;
    this.id = nanoid();

    this.manager.dispatch({
      type: "addScratch",
      layerId: "preview",
      id: this.id,
      payload: {
        tool: this.constructor.name,
        state: ScratchState.preview,
        color: this.manager.toolPanel!.color,
        thickness: this.manager.toolPanel!.thickness,
      },
    });

    this.addPoint(e);
  }

  private finishScratch() {
    const layer = this.manager.layers!.active;
    if (!this.active || !layer) return;
    this.active = false;

    this.manager.dispatch({
      type: "moveScratch",
      layerId: "preview",
      id: this.id,
      payload: {
        layerId: layer.id,
        state: ScratchState.active,
      },
    });
  }

  private addPoint(e: MouseEvent) {
    if (!this.active) return;

    const offsetX = this.manager.rect.left - this.manager.offset.x;
    const offsetY = this.manager.rect.top - this.manager.offset.y;

    this.manager.dispatch({
      type: "changeScratch",
      layerId: "preview",
      id: this.id,
      payload: {
        point: {
          x: e.x + offsetX,
          y: e.y + offsetY,
        },
      },
    });
  }

  protected disableListeners() {
    window.removeEventListener("mousedown", this.startScratch);
    window.removeEventListener("mouseup", this.finishScratch);
    window.removeEventListener("mousemove", this.addPoint);
  }

  protected applyListeners() {
    window.addEventListener("mousedown", this.startScratch);
    window.addEventListener("mouseup", this.finishScratch);
    window.addEventListener("mousemove", this.addPoint);
  }
}
