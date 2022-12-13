import { Drawer } from "../Drawer";

export interface IScratch {
  draw(drawer: Drawer): void;

  getId(): string;
}
