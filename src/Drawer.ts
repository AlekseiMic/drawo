import { IScratch, ScratchState } from "./interfaces/IScratch";
import { Layer } from "./Layer";
import { nanoid } from "nanoid";
import { Canvas } from "./Canvas";
import { DrawService } from "./DrawService";
import { Color } from "./interfaces/Color";
import { Pointable } from "./interfaces/Pointable";

export type StylesConfig = {
  color?: string;
  lineWidth?: number;
};

export class Drawer {
  private _layers: Record<
    string,
    { data?: ImageData; layer: Layer; canvas: Canvas }
  > = {};

  private _activeLayer: string | undefined;

  private _rect = {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  };

  private drawService = new DrawService();

  private stateColors: Partial<Record<ScratchState, Color>> = {
    [ScratchState.hovered]: { r: 150, g: 0, b: 255, a: 190 },
    [ScratchState.dragged]: { r: 255, g: 0, b: 0, a: 190 },
  };

  get width() {
    return this._rect.right - this._rect.left;
  }

  get height() {
    return this._rect.bottom - this._rect.top;
  }

  set width(w: number) {
    this._rect.right = this._rect.left + w;
  }

  set height(h: number) {
    this._rect.bottom = this._rect.top + h;
  }

  get active() {
    if (!this._activeLayer) return null;
    return this._layers[this._activeLayer].layer;
  }

  constructor(private _container: HTMLDivElement) {
    this.addResizeListener();
    this.updateSize();
    this.createLayer("preview", false, 1000);
  }

  getColorForState(
    state: ScratchState,
    fallback: Color = { r: 255, g: 255, b: 255, a: 255 }
  ): Color {
    return this.stateColors[state] ?? fallback;
  }

  // Check geometry and redraw only touched scratches on layer
  redraw(l: Layer, clear = false, scratches?: IScratch[], onlyActive = true) {
    const { canvas, layer } = this._layers[l.id];
    const items = scratches ?? layer.scratches;

    const imageData =
      scratches && !clear
        ? canvas.ctx.getImageData(0, 0, this.width, this.height)
        : new ImageData(this.width, this.height);

    // const start = performance.now();
    for (const s of items) {
      if (onlyActive && s.state !== ScratchState.active) continue;
      s.draw(imageData, this);
    }
    // console.log(`draw: ${performance.now() - start}ms`);

    canvas.ctx.putImageData(imageData, 0, 0);
  }

  preview(scratches?: IScratch[]) {
    const layer = this._layers["preview"].layer;
    this.redraw(layer, true, scratches, false);
  }

  putImageData(imageData: ImageData, scratch: IScratch & Pointable) {
    this.drawService.drawPixels(
      imageData,
      scratch,
      this.getColorForState(scratch.state, scratch.color)
    );
  }

  createLayer(id?: string, setActive = true, zIndex?: number) {
    const layer = new Layer(id ?? nanoid());
    this.addLayer(layer, zIndex);
    if (setActive) this._activeLayer = layer.id;
    return layer;
  }

  addLayer(layer: Layer, zIndex?: number) {
    const el = document.createElement("canvas");
    el.id = layer.id;

    const canvas = new Canvas(el);
    canvas.width = this.width;
    canvas.height = this.height;
    canvas.zIndex = (zIndex ?? Object.keys(this._layers).length) + "";

    this._container.appendChild(el);
    this._layers[layer.id] = { layer, canvas };
  }

  removeLayer(layer: Layer) {
    this._layers[layer.id].canvas.remove();
    delete this._layers[layer.id];
  }

  private addResizeListener() {
    window.addEventListener("resize", () => this.updateSize());
  }
  private updateSize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    Object.values(this._layers).forEach(({ layer, canvas }) => {
      canvas.width = this.width;
      canvas.height = this.height;
      this.redraw(layer);
    });
  }
}
