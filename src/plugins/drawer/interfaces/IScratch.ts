import { DrawService } from "../services";
import { RGBA } from "./Color";
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

  state: ScratchState;

  color?: RGBA;

  thickness: number;

  user: string;

  rect: Rect;

  width: number;

  height: number;

  isReady: boolean;

  prepare(): void;

  change(data: any): void;

  draw(data: ImageData, drawer: DrawService, rect?: Rect): void;

  isIntersectsRect(rect: Rect): boolean;

  isIntersects(point: Point, region?: number): boolean;

  move(point: Point): void;

  process(): void;
}
