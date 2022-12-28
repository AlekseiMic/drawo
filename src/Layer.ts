import { Drawer } from "./Drawer";
import { IScratch } from "./interfaces/IScratch";

export class Layer {
  private _scratches: Record<string, IScratch> = {};

  private _drawer: Drawer | null = null;

  private _id: string;

  constructor(id: string) {
    this._id = id;
  }

  get scratches() {
    return Object.values(this._scratches);
  }

  getId(): string {
    return this._id;
  }

  set drawer(drawer: Drawer) {
    this._drawer = drawer;
  }

  preview(scratch?: IScratch) {
    this._drawer?.preview(scratch);
  }

  draw(scratch?: IScratch): void {
    this._drawer?.redraw(this, scratch);
  }

  add(scratch: IScratch) {
    this._scratches[scratch.getId()] = scratch;
    this.draw(scratch);
  }

  remove(scratch: IScratch) {
    delete this._scratches[scratch.getId()];
    this.draw();
  }

  change(scratch: IScratch, id?: string) {
    this._scratches[id ?? scratch.getId()] = scratch;
    this.draw(scratch);
  }
}
