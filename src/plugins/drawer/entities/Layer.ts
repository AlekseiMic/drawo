import { nanoid } from 'nanoid';

export class Layer {
  public id: string;

  public zIndex: number;

  public scratches: string[] = [];

  public add(scratchId: string) {
    this.scratches.push(scratchId);
  }

  public remove(scratchId: string) {
    this.scratches = this.scratches.filter((s) => s !== scratchId);
  }

  public constructor(z: number, id?: string) {
    this.id = id ?? nanoid();
    this.zIndex = z;
  }

  public isOnTop(id: string) {
    return this.scratches[this.scratches.length - 1] !== id;
  }
}
