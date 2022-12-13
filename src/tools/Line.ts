import { StylesConfig } from "../Drawer";
import { ITool } from "../interfaces/ITool";
import { Layer } from "../Layer";
import { LineScratch } from "../scratches/LineScratch";

export class Line implements ITool {
  private active: boolean = false;

  private line: LineScratch | undefined;

  private _config?: StylesConfig;

  constructor(private readonly layer: Layer) {
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
    this.line.config = { color: "green", lineWidth: 0.25 };
    this.active = true;
    this.layer.add(this.line);
  }

  private mouseupListener(e: MouseEvent) {
    if (this.active && this.line) {
      this.active = false;
      this.line.end = {
        x: e.x,
        y: e.y,
      };
      if (this._config) this.line.config = this._config;
      this.layer.change(this.line);
    }
  }

  private mousemoveListener(e: MouseEvent) {
    if (!this.active || !this.line) return;
    this.line.end = {
      x: e.x,
      y: e.y,
    };
    this.layer.change(this.line);
  }

  activate(): void {
    this.applyListeners();
  }

  disable(): void {
    this.disableListeners();
  }

  disableListeners() {
    window.removeEventListener("mousedown", this.mousedownListener);
    window.removeEventListener("mouseup", this.mouseupListener);
    window.removeEventListener("mousemove", this.mousemoveListener);
  }

  applyListeners() {
    window.addEventListener("mousedown", this.mousedownListener);
    window.addEventListener("mouseup", this.mouseupListener);
    window.addEventListener("mousemove", this.mousemoveListener);
  }
}
