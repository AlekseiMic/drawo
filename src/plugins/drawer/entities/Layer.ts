import { nanoid } from 'nanoid';
import { IScratch } from '../interfaces/IScratch';

export type LayerOptions = Partial<{}>;

export class Layer {
  public id: string;

  public zIndex: number;

  private _scratches: Record<string, { order: number; scratch: IScratch }> = {};

  public _sorted: string[] = [];

  private _shouldSort = false;

  getScratchesObject() {
    return this._scratches;
  }

  get scratches() {
    if (this._shouldSort) {
      this._sorted.length = 0;
      this._sorted.push(
        ...Object.values(this._scratches)
          .sort((a, b) => a.order - b.order)
          .map((item) => item.scratch.id)
      );
    }
    return this._sorted;
  }

  constructor(z: number, id?: string) {
    this.id = id ?? nanoid();
    this.zIndex = z;
  }

  hasScratchesAbove(id: string) {
    return this._sorted[this._sorted.length - 1] !== id;
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
      this._sorted.push(scratch.id);
    } else {
      this._shouldSort = true;
    }
  }

  remove(scratchId: string) {
    if (this._sorted[this._sorted.length - 1] !== scratchId) {
      this._shouldSort = true;
    } else {
      this._sorted.pop();
    }
    delete this._scratches[scratchId];
  }
}
