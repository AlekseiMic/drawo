import { IScratch, ScratchState } from "../interfaces/IScratch";
import { ITool } from "../interfaces/ITool";
import { Point } from "../interfaces/Point";
import { Layer } from "../Layer";
import { Manager } from "../Manager";
import { throttle } from "../utils/throttle";

export class MoveTool implements ITool {
  private hovered: IScratch | null = null;

  private dragged: IScratch | null = null;

  private canvasDrag = false;

  private activated: boolean = false;

  private start: Point = { x: 0, y: 0 };

  constructor(private manager: Manager) {
    this.mouseMove = throttle(this.mouseMove.bind(this), 10);
    this.mouseDown = this.mouseDown.bind(this);
    this.mouseUp = this.mouseUp.bind(this);
  }

  activate(): void {
    if (!this.activated) {
      this.activated = true;
      this.applyListeners();
      document.body.style.cursor = "default";
    }
  }

  disable(): void {
    if (this.activated) {
      this.disableListeners();
      this.activated = false;
      document.body.style.cursor = "default";
    }
  }

  private applyListeners(): void {
    window.addEventListener("mousemove", this.mouseMove);
    window.addEventListener("mousedown", this.mouseDown);
    window.addEventListener("mouseup", this.mouseUp);
  }

  private disableListeners(): void {
    window.removeEventListener("mousemove", this.mouseMove);
    window.removeEventListener("mousedown", this.mouseDown);
    window.removeEventListener("mouseup", this.mouseUp);
  }

  private hover(s: IScratch) {
    this.hovered = s;
    this.hovered.state = ScratchState.hovered;
    // this.drawer.preview([s]);
    document.body.style.cursor = "grab";
  }

  private unhover() {
    if (!this.hovered) return;
    this.hovered.state = ScratchState.active;
    // this.drawer.preview();
    this.hovered = null;
    document.body.style.cursor = "default";
  }

  private drag(s: IScratch, layer: Layer) {
    this.dragged = s;
    this.dragged.state = ScratchState.dragged;
    // this.drawer.redraw(layer, true);
    // this.drawer.preview([this.dragged]);
  }

  private drop(layer: Layer) {
    if (!this.dragged) return;
    this.dragged.state = ScratchState.active;
    // this.drawer.redraw(layer, false, [this.dragged], false);
    // this.drawer.preview();
    this.dragged = null;
  }

  private isHovers(s: IScratch, p: Point) {
    if (s.state === ScratchState.hidden) return;
    const rect = s.rect;
    const region = 10;
    if (rect.left - region >= p.x || rect.right + region <= p.x) return;
    if (rect.top - region >= p.y || rect.bottom + region <= p.y) return;
    return s.isIntersects(p, region);
  }

  private mouseDown(event: MouseEvent) {
    document.body.style.cursor = "grabbing";
    this.start = { x: event.x, y: event.y };
    if (!this.hovered) {
      this.canvasDrag = true;
      return;
    }
    // const layer = this.drawer.active;
    // if (!layer) return;
    // this.drag(this.hovered, layer);
  }

  private mouseUp(event: MouseEvent) {
    document.body.style.cursor = "default";
    if (!this.dragged) {
      this.canvasDrag = false;
      return;
    }
    // const layer = this.drawer.active;
    // if (!layer) return;
    const s = this.dragged;
    // const point = {
    // x: event.x + this.drawer.rect.left,
    // y: event.y + this.drawer.rect.top,
    // };
    // this.drop(layer);
    // if (this.isHovers(s, point)) this.hover(s);
  }

  private dragMove(event: MouseEvent) {
    this.dragged!.move({
      x: event.x - this.start.x,
      y: event.y - this.start.y,
    });

    this.start = { x: event.x, y: event.y };
    // this.drawer.preview([this.dragged!]);
  }

  private dragCanvas(event: MouseEvent) {
    // this.drawer.move(event.x - this.start.x, event.y - this.start.y);
    this.start = { x: event.x, y: event.y };
  }

  private mouseMove(event: MouseEvent) {
    if (this.dragged) return this.dragMove(event);
    if (this.canvasDrag) return this.dragCanvas(event);

    // const p = {
    //   x: event.x + this.drawer.rect.left,
    //   y: event.y + this.drawer.rect.top,
    // };
    //
    // if (this.hovered && this.isHovers(this.hovered, p)) return;
    // if (this.hovered) this.unhover();
    //
    // for (const s of this.drawer.active?.scratches ?? []) {
    //   if (!this.isHovers(s, p)) continue;
    //   this.hover(s);
    //   break;
    // }
  }
}
