export class User {
  public id: string;

  public center = {
    x: 1000,
    y: 1000,
  };

  constructor(id: string) {
    this.id = id;
  }

  move(x: number, y: number) {
    this.center = {
      x: this.center.x - x,
      y: this.center.y - y,
    };
  }
}
