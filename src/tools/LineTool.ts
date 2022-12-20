import { Drawer, StylesConfig } from "../Drawer";
import { ITool } from "../interfaces/ITool";
import { LineScratch } from "../scratches/LineScratch";

export class LineTool implements ITool {
  private active: boolean = false;

  private line: LineScratch | undefined;

  private _config?: StylesConfig;

  private activated: boolean = false;

  constructor(private drawer: Drawer) {
    this.mouseupListener = this.mouseupListener.bind(this);
    this.mousedownListener = this.mousedownListener.bind(this);
    this.mousemoveListener = this.mousemoveListener.bind(this);
  }

  set config(config: StylesConfig) {
    this._config = config;
  }

  private mousedownListener(e: MouseEvent) {
    this.line = new LineScratch();
    this.line.end = {
      x: e.x,
      y: e.y,
    };
    this.line.start = {
      x: e.x,
      y: e.y,
    };
    this.line.config = { color: "green", lineWidth: 3 };
    this.active = true;
  }

  private mouseupListener(e: MouseEvent) {
    if (this.active && this.line) {
      this.active = false;
      this.line.end = {
        x: e.x,
        y: e.y,
      };
      if (this._config) this.line.config = this._config;
      this.drawer.active?.add(this.line);
      this.line = undefined;
      this.drawer.active?.preview(undefined);
    }
  }

  private mousemoveListener(e: MouseEvent) {
    if (!this.active || !this.line) return;
    this.line.end = {
      x: e.x,
      y: e.y,
    };
    this.drawer.active?.preview(this.line);
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
