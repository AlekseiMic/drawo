/* eslint-disable no-unused-vars */
import { Canvas } from '../entities/Canvas';
import { Rect } from '../interfaces/Rect';

export class CanvasManager {
  public rect: Rect = { left: 0, top: 0, right: 0, bottom: 0 };

  private _canvases: Record<string, { canvas: Canvas; data?: ImageData }> = {};

  private _container?: HTMLDivElement;

  setContainer(container: HTMLDivElement) {
    this._container = container;
  }

  public draw(
    layerId: string,
    clear: boolean,
    callback: (canvasManager: this, data: ImageData, rect: Rect) => ImageData
  ) {
    const data = callback(this, this.getImageData(layerId, clear), this.rect);
    this.putImageData(layerId, data);
  }

  public resize(layerId: string) {
    const canvas = this.get(layerId)?.canvas;
    if (!canvas) return;

    const width = this.rect.right - this.rect.left;
    const height = this.rect.bottom - this.rect.top;

    canvas.width = width;
    canvas.height = height;
  }

  public updateRect(rect: Rect): boolean {
    if (
      rect.left !== this.rect.left ||
      rect.top !== this.rect.top ||
      rect.right !== this.rect.right ||
      rect.bottom !== this.rect.bottom
    ) {
      this.rect = { ...rect };
      return true;
    }

    return false;
  }

  private get(layerId: string) {
    return this._canvases[layerId];
  }

  public add(layerId: string, zIndex: number) {
    if (this._canvases[layerId] || !this._container) return;
    const canvas = new Canvas(this._container, layerId, zIndex + '');
    this._canvases[layerId] = { canvas };
    this.resize(layerId);
  }

  public remove(layerId: string) {
    this._canvases[layerId].canvas.remove();
    delete this._canvases[layerId];
  }

  private getImageData(layerId: string, clear: boolean): ImageData {
    if (!this._canvases[layerId].data || clear) {
      const width = this.rect.right - this.rect.left;
      const height = this.rect.bottom - this.rect.top;
      this._canvases[layerId].data = new ImageData(width, height);
    }
    return this._canvases[layerId].data!;
  }

  private putImageData(layerId: string, data: ImageData) {
    const item = this._canvases[layerId];
    if (!item) return;
    item.canvas.ctx.putImageData(data, 0, 0);
    item.data = data;
  }
}
