import { ITool } from "../interfaces/ITool";
import { Manager } from "../Manager";
import { PenScratch } from "../scratches/PenScratch";
import { throttle } from "../utils/throttle";

export class PenTool implements ITool {
  private active: boolean = false;

  private activated: boolean = false;

  private scratch: PenScratch | undefined;

  constructor(private manager: Manager) {
    this.mouseupListener = this.mouseupListener.bind(this);
    this.mousedownListener = this.mousedownListener.bind(this);
    this.mousemoveListener = throttle(this.mousemoveListener.bind(this), 10);
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

  private mousedownListener(e: MouseEvent) {
    this.scratch = new PenScratch(this.manager.user);

    // this.scratch.addPoint({
    //   x: e.x + this.manager.rect.left,
    //   y: e.y + this.manager.rect.top,
    // });

    this.active = true;
  }

  private mouseupListener(e: MouseEvent) {
    const layer = this.manager.activeLayer;
    if (!this.active || !this.scratch || !layer) return;
    this.active = false;

    // this.scratch.addPoint({
    //   x: e.x + this.manager.rect.left,
    //   y: e.y + this.manager.rect.top,
    // });

    // this.manager?.active?.add(this.scratch);
    // this.drawer?.preview();
    // this.drawer.redraw(layer, false, [this.scratch]);
    this.scratch = undefined;
  }

  private mousemoveListener(e: MouseEvent) {
    if (!this.active || !this.scratch) return;
    // this.scratch.addPoint({
    //   x: e.x + this.manager.rect.left,
    //   y: e.y + this.manager.rect.top,
    // });
    // this.drawer?.preview([this.scratch]);
  }
}
