export class Canvas {
  private _context: CanvasRenderingContext2D;

  private _element: HTMLCanvasElement;

  get ctx() {
    return this._context;
  }

  set width(width: number) {
    this._element.width = width;
  }

  set height(height: number) {
    this._element.height = height;
  }

  set zIndex(zIndex: string) {
    this._element.style.zIndex = zIndex;
  }

  constructor(private _parent: HTMLDivElement, id: string, zIndex: string) {
    this._element = document.createElement("canvas");
    this._element.id = id;
    this.zIndex = zIndex;

    const context = this._element.getContext("2d", {
      willReadFrequently: true,
    });

    if (!context) throw new Error("Canvas not created!");

    const dpr = window.devicePixelRatio;

    this._context = context;
    this._context.scale(dpr, dpr);
    this.init();

    this._parent.appendChild(this._element);
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
