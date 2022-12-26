import { StylesConfig } from "./Drawer";

export class Canvas {
  private _context: CanvasRenderingContext2D;

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

  constructor(private _element: HTMLCanvasElement) {
    const context = this._element.getContext("2d");
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

  public applyToolStyles(config: StylesConfig) {
    const ctx = this.ctx;
    ctx.lineWidth = config.lineWidth ?? 10;
    ctx.strokeStyle = config.color ?? "white";
    ctx.fillStyle = config.color ?? "white";
  }
}
