import { RGBA } from "../interfaces/Color";
import { IScratch } from "../interfaces/IScratch";
import { Pointable } from "../interfaces/Pointable";
import { Rect } from "../interfaces/Rect";

export class DrawService {
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

    let x = rect.left - leftEdge;
    let y = rect.top - topEdge;
    const maxX = Math.min(rect.right - leftEdge, width);
    const maxY = Math.min(imageData.height, rect.bottom - topEdge);

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
      x = rect.left - leftEdge;
    }
  }
}
