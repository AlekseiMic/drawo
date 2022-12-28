import { IScratch, ScratchState } from "./interfaces/IScratch";
import { Point } from "./interfaces/Point";
import { Layer } from "./Layer";
import { nanoid } from "nanoid";
import { Canvas } from "./Canvas";

export type StylesConfig = {
  color?: string;
  lineWidth?: number;
};

export class Drawer {
  private _layers: Record<string, { layer: Layer; canvas: Canvas }> = {};

  private _activeLayer: string | undefined;

  public width: number = 0;

  public height: number = 0;

  get active() {
    if (!this._activeLayer) return null;
    return this._layers[this._activeLayer].layer;
  }

  constructor(private _container: HTMLDivElement) {
    this.addResizeListener();
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    const layer = this.createLayer("preview");
    this._layers[layer.getId()].canvas.zIndex = '1000';
  }

  createLayer(id?: string) {
    const layer = new Layer(id ?? nanoid());
    layer.drawer = this;
    this.addLayer(layer);
    this._activeLayer = layer.getId();
    return layer;
  }

  private addResizeListener() {
    window.addEventListener("resize", () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      Object.values(this._layers).forEach(({ layer, canvas }) => {
        canvas.width = this.width;
        canvas.height = this.height;
        this.redraw(layer);
      });
    });
  }

  clear(layer: Layer) {
    const canvas = this._layers[layer.getId()].canvas;
    canvas.ctx.clearRect(0, 0, this.width, this.height);
  }

  // Check geometry and redraw only touched scratches on layer
  redraw(layer: Layer, scratch?: IScratch) {
    const layerObj = this._layers[layer.getId()].layer;
    if (!layerObj) return;
    if (scratch && layer) return scratch.draw(layerObj, this);
    this.clear(layer);
    layerObj.scratches.forEach((s) =>
      s.state === ScratchState.active ? s.draw(layerObj, this) : {}
    );
  }

  preview(scratch?: IScratch) {
    const layer = this._layers["preview"].layer;
    this.clear(layer);
    if (scratch) this.redraw(layer, scratch);
  }

  putImageData(
    layer: Layer,
    points: Map<number, Point>,
    x: number,
    y: number,
    color: { r: number; g: number; b: number; alpha?: number }
  ) {
    const { canvas } = this._layers[layer.getId()];
    const ctx = canvas.ctx;
    const imageData = ctx.getImageData(0, 0, this.width, this.height);
    const data = imageData.data;

    const lineWidth = imageData.width * 4;
    const r = color?.r ?? 255;
    const g = color?.g ?? 255;
    const b = color?.b ?? 255;
    for (const [, point] of points) {
      const index = (x + point.x) * 4 + (point.y + y) * lineWidth;
      for (let i = 0; i <= 0; i++) {
        for (let j = 0; j <= 0; j++) {
          this.setPixelData(data, index - j * 4 + i * lineWidth, r, g, b);
          this.setPixelData(data, index - j * 4 - i * lineWidth, r, g, b);
          this.setPixelData(data, index + j * 4 + i * lineWidth, r, g, b);
          this.setPixelData(data, index + j * 4 - i * lineWidth, r, g, b);
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }

  private setPixelData(
    data: Uint8ClampedArray,
    idx: number,
    r: number,
    g: number,
    b: number,
    alpha = 255
  ) {
    data[idx] = r;
    data[idx + 1] = g;
    data[idx + 2] = b;
    data[idx + 3] = alpha;
  }

  drawCurve(layer: Layer, points: Point[], config: StylesConfig) {
    const { canvas } = this._layers[layer.getId()];
    const ctx = canvas.ctx;
    if (points.length <= 1) return;
    if (points.length === 2) {
      return this.drawLine(layer, points[0], points[1], config);
    }

    if (config) {
      canvas.ctx.save();
      canvas.applyToolStyles(config);
    }

    let i = 0;

    ctx.beginPath();
    ctx.moveTo(points[i].x, points[i].y);

    for (i = 1; i < points.length - 2; i++) {
      const deltaX = (points[i].x + points[i + 1].x) / 2;
      const deltaY = (points[i].y + points[i + 1].y) / 2;
      ctx.quadraticCurveTo(points[i].x, points[i].y, deltaX, deltaY);
    }

    ctx.quadraticCurveTo(
      points[i].x,
      points[i].y,
      points[i + 1].x,
      points[i + 1].y
    );
    ctx.stroke();

    if (config) canvas.ctx.restore();
  }

  drawPoint(layer: Layer, p: Point, config?: StylesConfig) {
    const canvas = this._layers[layer.getId()].canvas;
    const ctx = canvas.ctx;

    if (config) {
      canvas.ctx.save();
      canvas.applyToolStyles(config);
    }

    ctx.fillRect(p.x, p.y, 1, 1);

    if (config) canvas.ctx.restore();
  }

  drawLine(layer: Layer, start: Point, end: Point, config?: StylesConfig) {
    const canvas = this._layers[layer.getId()].canvas;
    const ctx = canvas.ctx;

    if (config) {
      canvas.ctx.save();
      canvas.applyToolStyles(config);
    }

    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.closePath();
    ctx.stroke();

    if (config) canvas.ctx.restore();
  }

  addLayer(layer: Layer) {
    const el = document.createElement("canvas");
    el.id = layer.getId();
    this._container.appendChild(el);
    const canvas = new Canvas(el);

    canvas.width = this.width;
    canvas.height = this.height;

    this._layers[layer.getId()] = { layer, canvas };
  }

  removeLayer(layer: Layer) {
    delete this._layers[layer.getId()];
  }
}
