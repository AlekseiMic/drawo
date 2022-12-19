import { Drawer, StylesConfig } from "../Drawer";
import { IScratch } from "../interfaces/IScratch";
import { Point } from "../interfaces/Point";
import { Layer } from "../Layer";

export class PenScratch implements IScratch {
  points: Point[] = [];

  config: StylesConfig = { color: "red" };

  draw(layer: Layer, drawer: Drawer) {
    drawer.drawCurve(layer, this.points, this.config);
  }

  getId(): string {
    return Date.now() + "";
  }
}
