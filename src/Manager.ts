import { Drawer } from "./Drawer";
import { Action } from "./interfaces/Action";
import { Rect } from "./interfaces/Rect";
import { Layer } from "./Layer";
import { Observer } from "./Observer";
import { LineScratch } from "./scratches/LineScratch";
import { ToolPanel } from "./ToolPanel";

export class Manager {
  public rect: Rect = { left: 0, top: 0, right: 0, bottom: 0 };

  public user: string;

  public activeLayer: Layer | null = null;

  public activeObserver: Observer | null = null;

  public toolPanel: ToolPanel;

  public observers: Observer[] = [];

  private _layers: Record<string, Layer> = {};

  private _drawer: Drawer;

  private _prevTS: number = 0;

  private _actions: {
    internal: {
      history: Action[];
      pending: Action[];
    };
    external: {
      history: Action[];
      pending: Action[];
    };
  } = {
    internal: { history: [], pending: [] },
    external: { history: [], pending: [] },
  };

  private _reducers: ((m: Manager, a: Action) => void)[] = [
    (m, a) => {
      switch (a.type) {
        case "addScratch": {
          // m._layers[a.payload.layoutId].add(new LineScratch(a.user!));
          break;
        }
        default:
          break;
      }
    },
  ];

  constructor(user: string, private _container: HTMLDivElement) {
    this.user = user;

    this.activeObserver = this.createObserver(user);

    this.update = this.update.bind(this);
    this.onResize = this.onResize.bind(this);

    this.onResize();

    this._drawer = new Drawer(this._container);
    this._drawer.updateRect(this.rect);

    this.toolPanel = new ToolPanel(this);

    this.createLayer("preview", 100000);
    const layer = this.createLayer(undefined);

    this.setActiveLayer(layer.id);
  }

  update(ts: number) {
    if (ts - this._prevTS < 500) {
      window.requestAnimationFrame(this.update);
      return;
    }
    const actions = this._actions.internal.pending;

    if (actions.length > 0) {
      actions.forEach((a) => this._reducers.forEach((r) => r(this, a)));
      this._actions.internal.history.push(...actions);
      this._actions.internal.pending = [];
    }

    this._prevTS = ts;
    window.requestAnimationFrame(this.update);
  }

  dispatch(action: Action | Action[], internal = true) {
    let arr = this._actions.external;
    let actions = Array.isArray(action) ? action : [action];
    if (internal) {
      arr = this._actions.internal;
      actions = actions.map((a) => {
        a.timestamp = Date.now();
        a.user = this.user;
        return a;
      });
    }
    arr.pending.push(...actions);
  }

  start() {
    this.listenResize();
    window.requestAnimationFrame(this.update);
  }

  end() {
    this.unlistenResize();
  }

  createObserver(user: string) {
    const observer = new Observer(user);
    this.observers.push(observer);
    return observer;
  }

  createLayer(id?: string, z?: number) {
    const layer = new Layer(id);
    this._layers[layer.id] = layer;
    this._drawer.addLayer(layer.id, z);
    return layer;
  }

  setActiveLayer(layerId: string) {
    if (!this._layers[layerId]) return;
    this.activeLayer = this._layers[layerId];
  }

  private onResize() {
    const width = this._container.clientWidth;
    const height = this._container.clientHeight;

    const offsetLeft = this._container.offsetLeft;
    const offsetTop = this._container.offsetTop;

    this.rect.right = this.rect.left + width - offsetLeft;
    this.rect.bottom = this.rect.top + height - offsetTop;

    if (this.activeObserver) {
      const center = this.activeObserver.center;
      this.rect.left = center.x - Math.floor(width / 2) - offsetLeft;
      this.rect.right = this.rect.left + width;
      this.rect.top = center.y - Math.floor(height / 2) - offsetTop;
      this.rect.bottom = this.rect.top + height;
    }

    // console.log({ width, height, offsetLeft, offsetTop });
    // console.log(this.rect);
  }

  private listenResize() {
    window.addEventListener("resize", this.onResize);
  }

  private unlistenResize() {
    window.removeEventListener("resize", this.onResize);
  }
}
