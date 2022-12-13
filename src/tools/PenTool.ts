import { StylesConfig } from "../Drawer";
import { ITool } from "../interfaces/ITool";
import { Layer } from "../Layer";
import { PenScratch } from "../scratches/PenScratch";

export class PenTool implements ITool {
  private active: boolean = false;

  private scratch: PenScratch | undefined;

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
    this.scratch = new PenScratch();
    this.scratch?.points.push({
      x: e.x,
      y: e.y,
    });
    this.scratch.config = { color: "green", lineWidth: 0.25 };
    this.active = true;
    this.layer.add(this.scratch);
  }

  private mouseupListener(e: MouseEvent) {
    if (this.active && this.scratch) {
      this.active = false;
      this.scratch.points.push({
        x: e.x,
        y: e.y,
      });
      if (this._config) this.scratch.config = this._config;
      this.layer.change(this.scratch);
    }
  }

  private mousemoveListener(e: MouseEvent) {
    if (!this.active || !this.scratch) return;
    this.scratch.points.push({
      x: e.x,
      y: e.y,
    });
    this.layer.change(this.scratch);
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
