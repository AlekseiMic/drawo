import { Drawer } from "../Drawer";
import { Layer } from "../Layer";

export interface IScratch {
  draw(layer: Layer, drawer: Drawer): void;

  getId(): string;

  getBoundingRect(): null | {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
}
