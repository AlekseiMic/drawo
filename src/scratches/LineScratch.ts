import { Drawer, StylesConfig } from "../Drawer";
import { IScratch } from "../interfaces/IScratch";
import { Point } from "../interfaces/Point";

export class LineScratch implements IScratch {
  start: Point = { x: 0, y: 0 };

  end: Point = { x: 0, y: 0 };

  config: StylesConfig = {};

  draw(drawer: Drawer) {
    drawer.drawLine(this.start, this.end, this.config);
  }

  getId(): string {
    return Date.now() + "";
  }
}
