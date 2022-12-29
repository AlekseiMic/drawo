import { Drawer } from "../Drawer";
import { IScratch, ScratchState } from "../interfaces/IScratch";
import { ITool } from "../interfaces/ITool";
import { Point } from "../interfaces/Point";
import { throttle } from "../utils/throttle";

export class MoveTool implements ITool {
  hovered: IScratch | null = null;

  dragged: IScratch | null = null;

  start: Point = { x: 0, y: 0 };

  inMove = false;

  moveEvent: MouseEvent | null = null;

  constructor(private drawer: Drawer) {
    this.mouseMove = throttle(this.mouseMove.bind(this), 10);
    this.mouseDown = this.mouseDown.bind(this);
    this.mouseUp = this.mouseUp.bind(this);
  }

  activate(): void {
    window.addEventListener("mousemove", this.mouseMove);
    window.addEventListener("mousedown", this.mouseDown);
    window.addEventListener("mouseup", this.mouseUp);
  }

  isHovers(s: IScratch, p: Point) {
    if (s.state === ScratchState.hidden) return;
    const rect = s.rect;
    const region = 3;
    if (rect.left - region >= p.x || rect.right + region <= p.x) return;
    if (rect.top - region >= p.y || rect.bottom + region <= p.y) return;
    return s.isIntersects(p, region);
  }

  mouseDown(event: MouseEvent) {
    if (!this.hovered) return;
    const layer = this.drawer.active;
    if (!layer) return;
    this.dragged = this.hovered;
    this.dragged.state = ScratchState.dragged;
    this.drawer.redraw(layer, true);
    this.drawer.preview([this.dragged]);
    this.start = { x: event.x, y: event.y };
    document.body.style.cursor = "grabbing";
  }

  mouseUp() {
    if (!this.dragged) return;
    const layer = this.drawer.active;
    if (!layer) return;
    this.hovered = this.dragged;
    this.dragged.state = ScratchState.hovered;
    this.drawer.redraw(layer, false, [this.dragged], false);
    this.drawer.preview();
    this.dragged = null;
    document.body.style.cursor = "pointer";
  }

  private dragMove(event: MouseEvent) {
    const rect = this.dragged!.rect;
    if (!rect) return;

    this.dragged!.move({
      x: event.x - this.start.x,
      y: event.y - this.start.y,
    });

    this.start = { x: event.x, y: event.y };
    this.drawer.preview([this.dragged!]);
  }

  mouseMove(event: MouseEvent) {
    if (this.dragged) return this.dragMove(event);

    const layer = this.drawer.active;
    if (!layer) return;

    const p = { x: event.x, y: event.y };

    if (this.hovered && this.isHovers(this.hovered, p)) return;

    if (this.hovered) {
      this.hovered.state = ScratchState.active;
      this.drawer.redraw(layer, false, [this.hovered]);
      this.hovered = null;
      document.body.style.cursor = "default";
    }

    for (const s of this.drawer.active?.scratches ?? []) {
      if (this.isHovers(s, p)) {
        this.hovered = s;
        s.state = ScratchState.hovered;
        this.drawer.redraw(layer, false, [s], false);
        document.body.style.cursor = "pointer";
        break;
      }
    }
  }

  disable(): void {
    window.removeEventListener("mousemove", this.mouseMove);
  }
}
