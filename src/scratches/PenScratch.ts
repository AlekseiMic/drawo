import { Drawer, StylesConfig } from "../Drawer";
import { IScratch } from "../interfaces/IScratch";
import { Point } from "../interfaces/Point";

export class PenScratch implements IScratch {
  points: Point[] = [];

  config: StylesConfig = {};

  draw(drawer: Drawer) {
    this.points.forEach((p) => {
      drawer.drawPoint(p, this.config);
    });
  }

  getId(): string {
    return Date.now() + "";
  }
}
