import { Drawer, StylesConfig } from "../Drawer";
import { IScratch, ScratchState } from "../interfaces/IScratch";
import { Point } from "../interfaces/Point";
import { Layer } from "../Layer";

export class PenScratch implements IScratch {
  state = ScratchState.active;

  points: Point[] = [];

  config: StylesConfig = { color: "red" };

  getBoundingRect() {
    return null;
    // return {
    //   left: this.offset.x,
    //   top: this.offset.y,
    //   right: this.offset.x + this.width,
    //   bottom: this.offset.y + this.height,
    // };
  }

  draw(layer: Layer, drawer: Drawer) {
    drawer.drawCurve(layer, this.points, this.config);
  }

  getId(): string {
    return Date.now() + "";
  }

  isIntersects(point: Point, region?: number | undefined): boolean {
    throw new Error("Method not implemented.");
  }
}
