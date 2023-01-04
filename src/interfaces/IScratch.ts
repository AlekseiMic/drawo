import { Drawer } from "../Drawer";
import { Color } from "./Color";
import { Point } from "./Point";

export enum ScratchState {
  "hidden" = 0,
  "active" = 1,
  "hovered" = 3,
  "preview" = 4,
  "dragged" = 5,
}

export interface IScratch {
  id: string;

  state: ScratchState;

  color: Color;

  user: string;

  rect: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };

  draw(data: ImageData, drawer: Drawer): void;

  isIntersects(point: Point, region?: number): boolean;

  move(point: Point): void;
}
