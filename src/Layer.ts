import { IScratch } from "./interfaces/IScratch";

export class Layer {
  private _scratches: IScratch[] = [];

  private _id: string;

  constructor(id: string) {
    this._id = id;
  }

  get scratches() {
    return Object.values(this._scratches);
  }

  set scratches(data: IScratch[]) {
    this._scratches = data;
  }

  get id(): string {
    return this._id;
  }

  add(scratch: IScratch) {
    this._scratches.push(scratch);
  }
}
