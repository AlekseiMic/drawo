import { Drawer } from "./Drawer";
import { IScratch } from "./interfaces/IScratch";

export class Layer {
  private _scratches: Record<string, IScratch> = {};

  private _drawer: Drawer | null = null;

  get scratches() {
    return Object.values(this._scratches);
  }

  getId(): string {
    return "id0";
  }

  set drawer(drawer: Drawer) {
    if (this._drawer) this._drawer.removeLayer(this);
    this._drawer = drawer;
    this._drawer.addLayer(this);
  }

  draw(): void {
    if (!this._drawer) throw new Error("Drawer not found");
    this._drawer.redraw();
  }

  add(scratch: IScratch) {
    this._scratches[scratch.getId()] = scratch;
    this.draw();
  }

  remove(scratch: IScratch) {
    delete this._scratches[scratch.getId()];
    this.draw();
  }

  change(scratch: IScratch, id?: string) {
    this._scratches[id ?? scratch.getId()] = scratch;
    this.draw();
  }
}
