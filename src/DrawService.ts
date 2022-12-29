import { Color } from "./interfaces/Color";
import { IScratch } from "./interfaces/IScratch";
import { Pointable } from "./interfaces/Pointable";

export class DrawService {
  drawPixels(
    imageData: ImageData,
    scratch: IScratch & Pointable,
    color: Color
  ) {
    const data = imageData.data;
    const points = scratch.points;
    const width = imageData.width;
    // const height = imageData.height;
    const offset = scratch.rect;

    const minX = offset.left;
    const minY = offset.top;
    // const maxX = minX + width;
    // const maxY = minY + height;

    for (let p = 0; p < points.length - 6; p = p + 2) {
      const idx = (minX + (minY + points[p + 1]) * width + points[p]) * 4;
      data[idx] = color.r;
      data[idx + 1] = color.g;
      data[idx + 2] = color.b;
      data[idx + 3] = color.a;
    }
  }
}
