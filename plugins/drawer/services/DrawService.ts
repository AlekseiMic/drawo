import { RGBA } from '../interfaces/Color';
import { IScratch } from '../interfaces/IScratch';
import { Pointable } from '../interfaces/Pointable';
import { Rect } from '../interfaces/Rect';
import { CanvasManager } from './CanvasManager';
import { SettingsStore } from './SettingsStore';

export class DrawService {
  constructor(
    private _canvasManager: CanvasManager,
    private _settings: SettingsStore
  ) {}

  draw(imageData: ImageData, scratch: IScratch & Pointable, rect?: Rect) {
    this.drawPixels(
      imageData,
      scratch,
      this._settings.getColorForState(scratch.state, scratch.color),
      this._canvasManager.rect.left,
      this._canvasManager.rect.top,
      rect ?? this._canvasManager.rect
    );
  }

  clear(imageData: ImageData, rect?: Rect) {
    this.clearRect(
      imageData,
      this._canvasManager.rect.left,
      this._canvasManager.rect.top,
      rect ?? this._canvasManager.rect
    );
  }

  // eslint-disable-next-line no-dupe-class-members
  drawPixels(
    imageData: ImageData,
    scratch: IScratch & Pointable,
    color: RGBA,
    leftEdge: number,
    topEdge: number,
    rect: Rect
  ) {
    const data = imageData.data;
    const points = scratch.points;

    const width = imageData.width;
    const height = imageData.height;

    const offsetX = scratch.rect.left - leftEdge;
    const offsetY = scratch.rect.top - topEdge;

    const minX = Math.max(1, rect.left - leftEdge);
    const minY = Math.max(1, rect.top - topEdge);
    const maxX = Math.min(rect.right - leftEdge, width - 1);
    const maxY = Math.min(rect.bottom - topEdge, height - 1);

    for (let p = 0; p < points.length - 6; p = p + 2) {
      const x = points[p] + offsetX;
      const y = points[p + 1] + offsetY;
      if (!(x >= minX && y >= minY && y <= maxY && x <= maxX)) continue;

      const idx = (y * width + x) * 4;
      data[idx] = color.r;
      data[idx + 1] = color.g;
      data[idx + 2] = color.b;
      data[idx + 3] = color.a;
    }
  }

  clearRect(
    imageData: ImageData,
    leftEdge: number,
    topEdge: number,
    rect: Rect
  ) {
    const data = imageData.data;

    const width = imageData.width;
    const height = imageData.height;

    const minX = Math.max(1, rect.left - leftEdge);
    const minY = Math.max(1, rect.top - topEdge);
    const maxX = Math.min(rect.right - leftEdge, width - 1);
    const maxY = Math.min(rect.bottom - topEdge, height - 1);

    let x = minX;
    let y = minY;
    let idx = 0;
    while (y <= maxY) {
      idx = 4 * (y * width + x);
      while (x <= maxX) {
        data[idx] = 0;
        data[idx + 1] = 0;
        data[idx + 2] = 0;
        data[idx + 3] = 0;
        x += 1;
        idx += 4;
      }
      y += 1;
      x = minX;
    }
  }
}
