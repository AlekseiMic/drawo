import { Canvas } from "./Canvas";
import { Point } from "./interfaces/Point";
import { Layer } from "./Layer";

export type StylesConfig = {
  color?: string;
  lineWidth?: number;
};

export class Drawer {
  private _layers: Record<string, Layer> = {};

  private _config: StylesConfig = {
    color: "white",
    lineWidth: 2,
  };

  constructor(private readonly canvas: Canvas) {
    this.applyStyles(this._config);
  }

  set config(config: StylesConfig) {
    this._config = config;
    this.applyStyles(config);
  }

  get config() {
    return this._config;
  }

  clear() {
    this.canvas.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  redraw() {
    this.clear();
    for (const layer in this._layers) {
      this._layers[layer].scratches.forEach((s) => s.draw(this));
    }
  }

  drawPoint(p: Point, config: StylesConfig) {
    const ctx = this.canvas.ctx;
    const prevConfig = this.config;

    if (config) this.config = config;

    ctx.fillRect(
      p.x,
      p.y,
      this.config.lineWidth ?? 1,
      this.config.lineWidth ?? 1
    );

    if (config) this.config = prevConfig;
  }

  drawLine(start: Point, end: Point, config?: StylesConfig) {
    const ctx = this.canvas.ctx;
    const prevConfig = this.config;

    if (config) this.config = config;

    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.closePath();
    ctx.stroke();

    if (config) this.config = prevConfig;
  }

  private applyStyles(config: StylesConfig) {
    const ctx = this.canvas.ctx;
    ctx.lineWidth = config.lineWidth ?? 10;
    ctx.strokeStyle = config.color ?? "white";
    ctx.fillStyle = config.color ?? "white";
  }

  addLayer(layer: Layer) {
    this._layers[layer.getId()] = layer;
  }

  removeLayer(layer: Layer) {
    delete this._layers[layer.getId()];
  }
}
