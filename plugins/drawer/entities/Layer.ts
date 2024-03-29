export interface IRawLayer {
  id: string;
  zIndex: number;
}

export class Layer implements IRawLayer {
  public id: string;

  public zIndex: number;

  public constructor(z: number, id: string) {
    this.id = id;
    this.zIndex = z;
  }
}
