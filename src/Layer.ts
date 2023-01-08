import { nanoid } from "nanoid";
import { IScratch } from "./interfaces/IScratch";

export type LayerOptions = Partial<{}>;

export class Layer {
  public id: string;

  private _scratches: Record<string, { order: number; scratch: IScratch }> = {};

  private _sorted: IScratch[] = [];

  private _shouldSort = false;

  get scratches() {
    if (this._shouldSort) {
      this._sorted = Object.values(this._scratches)
        .sort((a, b) => a.order - b.order)
        .map((item) => item.scratch);
    }
    return this._sorted;
  }

  constructor(id?: string) {
    this.id = id ?? nanoid();
  }

  hasScratchesAbove(id: string) {
    return this._sorted[this._sorted.length - 1].id !== id;
  }

  setMultiple(data: { order: number; scratch: IScratch }[]) {
    this._scratches = data.reduce((acc: typeof this._scratches, item) => {
      acc[item.scratch.id] = item;
      return acc;
    }, {});
    this._shouldSort = true;
  }

  getScratch(id: string | undefined) {
    if (!id) return undefined;
    const scratch = this._scratches[id];
    return scratch?.scratch;
  }

  add(scratch: IScratch, order?: number) {
    this._scratches[scratch.id] = {
      order: order ?? Object.keys(this._scratches).length,
      scratch,
    };
    if (!order) {
      this._sorted.push(scratch);
    } else {
      this._shouldSort = true;
    }
  }

  remove(scratchId: string) {
    delete this._scratches[scratchId];
    this._shouldSort = true;
  }
}
