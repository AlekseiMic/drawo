import { Drawer } from "../Drawer";
import { Color } from "./Color";
import { Point } from "./Point";
import { Rect } from "./Rect";

export enum ScratchState {
  "hidden" = 0,
  "active" = 1,
  "hovered" = 3,
  "preview" = 4,
  "dragged" = 5,
}

export interface IScratch {
  id: string;

  state?: ScratchState;

  color?: Color;

  thickness: number;

  user: string;

  rect: Rect;

  width: number;

  height: number;

  isReady: boolean;

  prepare(): void;

  change(data: any): void;

  draw(data: ImageData, drawer: Drawer, rect?: Rect): void;

  isIntersectsRect(rect: Rect): boolean;

  isIntersects(point: Point, region?: number): boolean;

  move(point: Point): void;

  process(): void;
}
