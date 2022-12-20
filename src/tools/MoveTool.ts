import { Drawer } from "../Drawer";
import { ITool } from "../interfaces/ITool";

export class MoveTool implements ITool {
  constructor(private drawer: Drawer) {
    this.mouseMove = this.mouseMove.bind(this);
  }

  activate(): void {
    window.addEventListener("mousemove", this.mouseMove);
  }

  mouseMove(event: MouseEvent) {
    this.drawer.active?.scratches.forEach((s) => {
      const rect = s.getBoundingRect();
      if (!rect) return;
      if (rect.left >= event.x && rect.right <= event.x) {
        console.log({ rect, x: event.x, y: event.y });
      }
    });
  }

  disable(): void {
    window.removeEventListener("mousemove", this.mouseMove);
  }
}
