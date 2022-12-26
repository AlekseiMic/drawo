import { Drawer } from "../Drawer";
import { IScratch, ScratchState } from "../interfaces/IScratch";
import { ITool } from "../interfaces/ITool";
import { Point } from "../interfaces/Point";

export class MoveTool implements ITool {
  hovered: IScratch | null = null;

  dragged: IScratch | null = null;

  start: Point = { x: 0, y: 0 };

  inMove = false;

  moveEvent: MouseEvent | null = null;

  constructor(private drawer: Drawer) {
    this.mouseMove = this.mouseMove.bind(this);
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
    const rect = s.getBoundingRect();
    if (!rect) return;
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
    this.dragged.state = ScratchState.hidden;
    this.drawer.redraw(layer);
    this.drawer.preview(this.dragged);
    this.start = { x: event.x, y: event.y };
    document.body.style.cursor = "grabbing";
  }

  mouseUp() {
    if (!this.dragged) return;
    const layer = this.drawer.active;
    if (!layer) return;
    this.dragged.state = ScratchState.hovered;
    this.drawer.redraw(layer, this.dragged);
    this.dragged = null;
    document.body.style.cursor = "pointer";
  }

  private dragMove(event: MouseEvent) {
    const rect = this.dragged!.getBoundingRect();
    if (!rect) return;

    this.dragged!.move({
      x: rect.left + (event.x - this.start.x),
      y: rect.top + (event.y - this.start.y),
    });

    this.start = { x: event.x, y: event.y };
    this.drawer.preview(this.dragged!);
  }

  mouseMove(event: MouseEvent) {
    if (this.dragged) return this.dragMove(event);

    if (this.inMove) {
      this.moveEvent = event;
      return;
    }

    this.inMove = true;

    setTimeout(() => {
      this.inMove = false;
      if (!this.moveEvent) return;
      const lastEvent = this.moveEvent;
      this.moveEvent = null;
      this.mouseMove(lastEvent);
    }, 10);

    const layer = this.drawer.active;
    if (!layer) return;

    const p = { x: event.x, y: event.y };

    if (this.hovered && this.isHovers(this.hovered, p)) return;

    if (this.hovered) {
      this.hovered.state = ScratchState.active;
      this.drawer.redraw(layer, this.hovered);
      this.hovered = null;
      document.body.style.cursor = "default";
    }

    for (const s of this.drawer.active?.scratches ?? []) {
      if (this.isHovers(s, p)) {
        this.hovered = s;
        s.state = ScratchState.hovered;
        this.drawer.redraw(layer, s);
        document.body.style.cursor = "pointer";
        break;
      }
    }
  }

  disable(): void {
    window.removeEventListener("mousemove", this.mouseMove);
  }
}
