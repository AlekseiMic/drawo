import { IScratch, ScratchState } from "./interfaces/IScratch";
import { Canvas } from "./Canvas";
import { DrawService } from "./DrawService";
import { Color } from "./interfaces/Color";
import { Pointable } from "./interfaces/Pointable";
import { Rect } from "./interfaces/Rect";

export class Drawer {
  private drawService = new DrawService();

  private stateColors: Partial<Record<ScratchState, Color>> = {
    [ScratchState.hovered]: { r: 150, g: 0, b: 255, a: 190 },
    [ScratchState.dragged]: { r: 255, g: 0, b: 0, a: 190 },
  };

  private _rect: Rect = { left: 0, top: 0, right: 0, bottom: 0 };

  private _canvases: Record<string, Canvas> = {};

  constructor(private _container: HTMLDivElement) {}

  getColorForState(
    state: ScratchState,
    fallback: Color = { r: 255, g: 255, b: 255, a: 255 }
  ): Color {
    return this.stateColors[state] ?? fallback;
  }

  putImageData(imageData: ImageData, scratch: IScratch & Pointable) {
    this.drawService.drawPixels(
      imageData,
      scratch,
      this.getColorForState(scratch.state, scratch.color),
      this._rect.left,
      this._rect.top
    );
  }

  addLayer(layerId: string, zIndex?: number) {
    if (this._canvases[layerId]) return;
    const z = (zIndex ?? Object.keys(this._canvases).length) + "";
    const canvas = new Canvas(this._container, layerId, z);
    this._canvases[layerId] = canvas;
    this.updateCanvasSize(layerId);
  }

  updateCanvasSize(layerId: string) {
    const canvas = this._canvases[layerId];
    const width = this._rect.right - this._rect.left;
    const height = this._rect.bottom - this._rect.top;
    canvas.width = width;
    canvas.height = height;
  }

  removeLayer(layerId: string) {
    this._canvases[layerId].remove();
    delete this._canvases[layerId];
  }

  public updateRect(rect: Rect): boolean {
    if (
      rect.left !== this._rect.left ||
      rect.top !== this._rect.top ||
      rect.right !== this._rect.right ||
      rect.bottom !== this._rect.bottom
    ) {
      this._rect = rect;
      return true;
    }

    return false;
  }
}
