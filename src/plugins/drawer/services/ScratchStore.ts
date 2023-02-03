import { IScratch } from '../interfaces';

export class ScratchStore {
  private _scratches: Record<string, IScratch> = {};

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
