import { IScratch, ScratchState } from "../interfaces/IScratch";
import { ITool } from "../interfaces/ITool";
import { Point } from "../interfaces/Point";
import { Manager } from "../Manager";
import { throttle } from "../utils/throttle";
import { BaseTool } from "./BaseTool";

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
  }

  private hover(s: IScratch) {
    document.body.style.cursor = "grab";
    this.hovered = s;
    this.manager.dispatch({
      type: "moveScratch",
      layerId: this.manager.activeLayer!.id,
      id: s.id,
      payload: {
        layerId: "preview",
        state: ScratchState.hovered,
      },
    });
  }

  private unhover() {
    if (!this.hovered) return;
    const s = this.hovered;
    document.body.style.cursor = "default";
    this.hovered = null;
    this.manager.dispatch({
      type: "moveScratch",
      layerId: "preview",
      id: s.id,
      payload: {
        layerId: this.manager.activeLayer!.id,
        state: ScratchState.active,
      },
    });
  }

  private drag(s: IScratch) {
    this.dragged = s;
    this.manager.dispatch({
      type: "changeScratch",
      layerId: "preview",
      id: s.id,
      payload: {
        state: ScratchState.dragged,
      },
    });
  }

  private drop() {
    if (!this.dragged) return;
    const s = this.dragged;
    this.dragged = null;
    this.manager.dispatch({
      type: "changeScratch",
      layerId: "preview",
      id: s.id,
      payload: {
        state: ScratchState.hovered,
      },
    });
  }

  private isHovers(s: IScratch, p: Point) {
    if (s.state === ScratchState.hidden) return false;
    const rect = s.rect;
    const region = 10;
    if (rect.left - region >= p.x || rect.right + region <= p.x) return false;
    if (rect.top - region >= p.y || rect.bottom + region <= p.y) return false;
    return s.isIntersects(p, region);
  }

  private mouseDown(event: MouseEvent) {
    document.body.style.cursor = "grabbing";
    this.start = { x: event.x, y: event.y };
    if (!this.hovered) {
      this.canvasDrag = true;
      return;
    }
    const layer = this.manager.activeLayer;
    if (!layer) return;
    this.drag(this.hovered);
  }

  private mouseUp(event: MouseEvent) {
    document.body.style.cursor = "grab";
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

  private dragMove(event: MouseEvent) {
    this.manager.dispatch({
      type: "translateScratch",
      layerId: "preview",
      id: this.dragged!.id,
      payload: {
        move: {
          x: event.x - this.start.x,
          y: event.y - this.start.y,
        },
      },
    });
    this.start = { x: event.x, y: event.y };
  }

  private dragCanvas(event: MouseEvent) {
    const observer = this.manager.activeObserver;
    if (!observer) return;
    this.manager.dispatch({
      type: "moveObserver",
      id: observer.id,
      payload: {
        x: event.x - this.start.x,
        y: event.y - this.start.y,
      },
    });
    this.start = { x: event.x, y: event.y };
  }

  private mouseMove(event: MouseEvent) {
    if (!this.manager.activeLayer) return;
    if (this.dragged) return this.dragMove(event);
    if (this.canvasDrag) return this.dragCanvas(event);

    const p = {
      x: event.x + this.manager.rect.left - this.manager.offset.x,
      y: event.y + this.manager.rect.top - this.manager.offset.y,
    };

    if (this.hovered && this.isHovers(this.hovered, p)) return;
    if (this.hovered) this.unhover();

    for (const s of this.manager.activeLayer.scratches) {
      if (!this.isHovers(s, p)) continue;
      this.hover(s);
      break;
    }
  }

  protected applyListeners(): void {
    window.addEventListener("mousemove", this.mouseMove);
    window.addEventListener("mousedown", this.mouseDown);
    window.addEventListener("mouseup", this.mouseUp);
  }

  protected disableListeners(): void {
    window.removeEventListener("mousemove", this.mouseMove);
    window.removeEventListener("mousedown", this.mouseDown);
    window.removeEventListener("mouseup", this.mouseUp);
  }
}
