import { Point } from "../interfaces/Point";

export const line = (p1: Point, p2: Point) => {
  const x1 = p1.x;
  const y1 = p1.y;

  const x2 = p2.x;
  const y2 = p2.y;

  const dx = Math.abs(x2 - x1);
  const sx = x1 < x2 ? 1 : -1;

  const dy = -Math.abs(y2 - y1);
  const sy = y1 < y2 ? 1 : -1;

  let x = x1;
  let y = y1;
  let e2;
  let er = dx + dy;

  const points = [];

  let i = 0;
  while (true) {
    if (x === x2 && y === y2) break;
    points[i++] = x;
    points[i++] = y;

    e2 = 2 * er;
    if (e2 > dy) {
      er += dy;
      x += sx;
    }
    if (e2 < dx) {
      er += dx;
      y += sy;
    }
  }

  return points;
};

export const distanceToLine = (p1: Point, p2: Point, point: Point) => {
  const distance =
    Math.abs(
      (p2.x - p1.x) * (p1.y - point.y) - (p1.x - point.x) * (p2.y - p1.y)
    ) / Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
  return distance;
};
