export class Observer {
  public center = {
    x: 1000,
    y: 1000,
  };

  public id: string;

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
