import { Drawer } from "../Drawer";

export interface IUI {
  activate(drawer: Drawer): void;
  draw(): void;
}
