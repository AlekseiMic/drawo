import { nanoid } from "nanoid";
import { IScratch } from "./interfaces/IScratch";

export type LayerOptions = Partial<{}>;

export class Layer {
  public id: string;

  private _scratches: Record<string, IScratch> = {};

  get scratches() {
    return Object.values(this._scratches);
  }

  set scratches(data: IScratch[]) {
    this._scratches = data.reduce((acc: Record<string, IScratch>, scratch) => {
      acc[scratch.id] = scratch;
      return acc;
    }, {});
  }

  constructor(id?: string) {
    this.id = id ?? nanoid();
  }

  add(scratch: IScratch) {
    this._scratches[scratch.id] = scratch;
  }
}
