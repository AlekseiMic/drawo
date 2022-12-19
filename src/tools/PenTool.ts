import { Drawer, StylesConfig } from "../Drawer";
import { ITool } from "../interfaces/ITool";
import { PenScratch } from "../scratches/PenScratch";

export class PenTool implements ITool {
  private active: boolean = false;

  private activated: boolean = false;

  private scratch: PenScratch | undefined;

  private _config?: StylesConfig;

  constructor(private drawer: Drawer) {
    this.mouseupListener = this.mouseupListener.bind(this);
    this.mousedownListener = this.mousedownListener.bind(this);
    this.mousemoveListener = this.mousemoveListener.bind(this);
  }

  set config(config: StylesConfig) {
    this._config = config;
  }

  private mousedownListener(e: MouseEvent) {
    this.scratch = new PenScratch();
    this.scratch?.points.push({
      x: e.x,
      y: e.y,
    });
    this.scratch.config = { color: "green", lineWidth: 0.25 };
    this.active = true;
  }

  private mouseupListener(e: MouseEvent) {
    if (this.active && this.scratch) {
      this.active = false;
      this.scratch.points.push({
        x: e.x,
        y: e.y,
      });
      if (this._config) this.scratch.config = this._config;
      this.drawer?.active?.add(this.scratch);
      this.drawer?.active?.preview();
    }
  }

  private mousemoveListener(e: MouseEvent) {
    if (!this.active || !this.scratch) return;
    this.scratch.points.push({
      x: e.x,
      y: e.y,
    });
    this.drawer?.active?.preview(this.scratch);
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
}
