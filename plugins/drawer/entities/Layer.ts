export class Layer {
  public id: string;

  public zIndex: number;

  public constructor(z: number, id: string) {
    this.id = id;
    this.zIndex = z;
  }
}
