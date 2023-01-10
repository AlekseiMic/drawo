import { Action } from "./Action";
import { IScratch } from "./IScratch";

export interface ITool {
  activate(): void;
  disable(): void;
  create?(action: Action): IScratch;
}
