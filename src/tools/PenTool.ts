import { Drawer } from "../Drawer";
import { ITool } from "../interfaces/ITool";
import { PenScratch } from "../scratches/PenScratch";

export class PenTool implements ITool {
  private active: boolean = false;

  private activated: boolean = false;

  private scratch: PenScratch | undefined;

  constructor(private drawer: Drawer) {
    this.mouseupListener = this.mouseupListener.bind(this);
    this.mousedownListener = this.mousedownListener.bind(this);
    this.mousemoveListener = this.mousemoveListener.bind(this);
  }

  activate(): void {
    if (!this.activated) {
      this.activated = true;
      this.applyListeners();
    }
  }

  disable(): void {
    if (this.activated) {
      this.disableListeners();
      this.activated = false;
    }
  }

  private mousedownListener(e: MouseEvent) {
    this.scratch = new PenScratch();
    this.scratch?.addPoint({ x: e.x, y: e.y });
    this.active = true;
  }

  private mouseupListener(e: MouseEvent) {
    const layer = this.drawer.active;
    if (!this.active || !this.scratch || !layer) return;
    this.active = false;
    this.scratch.addPoint({ x: e.x, y: e.y });
    this.drawer?.active?.add(this.scratch);
    this.drawer?.preview();
    this.drawer.redraw(layer, false, [this.scratch]);
    this.scratch = undefined;
  }

  private mousemoveListener(e: MouseEvent) {
    if (!this.active || !this.scratch) return;
    this.scratch.addPoint({ x: e.x, y: e.y });
    this.drawer?.preview([this.scratch]);
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
