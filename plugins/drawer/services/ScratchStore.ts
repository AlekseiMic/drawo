import { IScratch } from '../interfaces';
import { ScratchFactory } from '../scratches/ScratchFactory';

export class ScratchStore {
  private _scratches: Record<string, IScratch> = {};

  serialize() {
    return Object.values(this._scratches).map((s) => s.serialize());
  }

  deserialize(data?: IScratch[]) {
    this._scratches =
      data?.reduce<typeof this._scratches>((acc, s) => {
        const scratch = ScratchFactory.unserialize(s);
        if (scratch) {
          acc[scratch.id] = scratch;
        }

        return acc;
      }, {}) ?? {};
  }

  clear() {
    this._scratches = {};
  }

  get(id: string) {
    return this._scratches[id];
  }

  add(scratch: IScratch) {
    this._scratches[scratch.id] = scratch;
  }

  remove(id: string) {
    delete this._scratches[id];
  }
}
