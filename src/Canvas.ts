export class Canvas {
  private _context: CanvasRenderingContext2D;

  private _width: number = 0;

  private _height: number = 0;

  get ctx() {
    return this._context;
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  set width(width: number) {
    this._width = width;
    this._element.width = width;
  }

  set height(height: number) {
    this._height = height;
    this._element.height = height;
  }

  set zIndex(zIndex: string) {
    this._element.style.zIndex = zIndex;
  }

  constructor(private _element: HTMLCanvasElement) {
    const context = this._element.getContext("2d", {
      willReadFrequently: true,
    });

    if (!context) throw new Error("Canvas not created!");

    const dpr = window.devicePixelRatio;

    this._context = context;
    this._context.scale(dpr, dpr);

    this.init();
  }

  init() {
    this._element.style.position = "absolute";
    this._element.style.top = "0px";
    this._element.style.left = "0px";
    this._element.style.backgroundColor = "transparent";
  }

  remove() {
    this._element.remove();
  }
}
