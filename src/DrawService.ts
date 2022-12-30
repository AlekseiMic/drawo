import { Color } from "./interfaces/Color";
import { IScratch } from "./interfaces/IScratch";
import { Pointable } from "./interfaces/Pointable";

export class DrawService {
  drawPixels(
    imageData: ImageData,
    scratch: IScratch & Pointable,
    color: Color,
    minX = 0,
    minY = 0
  ) {
    const data = imageData.data;
    const points = scratch.points;
    const width = imageData.width;
    const height = imageData.height;

    const offsetX = scratch.rect.left - minX;
    const offsetY = scratch.rect.top - minY;

    for (let p = 0; p < points.length - 6; p = p + 2) {
      const x = points[p] + offsetX;
      const y = points[p + 1] + offsetY;
      if (x >= width || y >= height || y <= 0 || x <= 0) continue;

      const idx = (y * width + x) * 4;
      data[idx] = color.r;
      data[idx + 1] = color.g;
      data[idx + 2] = color.b;
      data[idx + 3] = color.a;
    }
  }
}
