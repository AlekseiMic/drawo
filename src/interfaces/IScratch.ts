import { Drawer } from "../Drawer";
import { Layer } from "../Layer";
import { Point } from "./Point";

export interface IScratch {
  draw(layer: Layer, drawer: Drawer): void;

  getId(): string;

  getBoundingRect(): null | {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };

  isIntersects(point: Point): boolean;
}
