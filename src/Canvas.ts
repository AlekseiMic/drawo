export class Canvas {
  private rect = {
    width: 0,
    height: 0,
  };

  private context: CanvasRenderingContext2D;

  get ctx() {
    return this.context;
  }

  set width(width: number) {
    this.canvas.width = width;
    this.rect.width = width;
  }

  set height(height: number) {
    this.canvas.height = height;
    this.rect.height = height;
  }

  get width() {
    return this.rect.width;
  }

  get height() {
    return this.rect.height;
  }

  constructor(private readonly canvas: HTMLCanvasElement) {
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error('Canvas not created: "cannot access context!"');
    }
    this.context = context;
  }

  init() {
    this.applyStyles();
    this.applyListeners();
    this.resize();
  }

  private applyStyles() {
    this.canvas.style.position = "absolute";
    this.canvas.style.top = "0px";
    this.canvas.style.left = "0px";
    this.canvas.style.backgroundColor = "#000000";
  }

  private resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
  }

  private addResizeListener() {
    window.addEventListener("resize", (e) => {
      console.log(e);
      this.resize();
    });
  }

  private applyListeners() {
    this.addResizeListener();
  }
}
