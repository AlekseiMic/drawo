import { Drawer } from "../Drawer";
import { Layer } from "../Layer";
import { Point } from "./Point";

export enum ScratchState {
  "hidden" = 0,
  "active" = 1,
  "hovered" = 3,
  "preview" = 4
}

export interface IScratch {
  state: ScratchState;

  draw(layer: Layer, drawer: Drawer): void;

  getId(): string;

  getBoundingRect(): null | {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };

  isIntersects(point: Point, region?: number): boolean;

  move(point: Point): void;
}
