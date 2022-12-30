import { Drawer } from "../Drawer";
import { ITool } from "../interfaces/ITool";
import { LineScratch } from "../scratches/LineScratch";

export class LineTool implements ITool {
  private active: boolean = false;

  private line: LineScratch | undefined;

  private activated: boolean = false;

  constructor(private drawer: Drawer) {
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
    this.line = new LineScratch();
    const offsetX = this.drawer.rect.left;
    const offsetY = this.drawer.rect.top;
    this.line.end = { x: e.x + offsetX, y: e.y + offsetY };
    this.line.start = { x: e.x + offsetX, y: e.y + offsetY };
    this.active = true;
  }

  private mouseupListener(e: MouseEvent) {
    const layer = this.drawer.active;
    const line = this.line;
    if (!layer || !this.active || !line) return;

    this.active = false;
    this.line = undefined;

    const offsetX = this.drawer.rect.left;
    const offsetY = this.drawer.rect.top;
    line.end = { x: e.x + offsetX, y: e.y + offsetY };
    layer.add(line);
    this.drawer.redraw(layer, false, [line]);
    this.drawer.preview(undefined);
  }

  private mousemoveListener(e: MouseEvent) {
    if (!this.active || !this.line) return;
    const offsetX = this.drawer.rect.left;
    const offsetY = this.drawer.rect.top;
    this.line.end = { x: e.x + offsetX, y: e.y + offsetY };
    this.drawer.preview([this.line]);
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
