import { Drawer } from "./Drawer";
import { Point } from "./interfaces";
import { Action } from "./interfaces/Action";
import { Rect } from "./interfaces/Rect";
import { Layer } from "./Layer";
import { Observer } from "./Observer";
import { RedrawState } from "./RedrawState";
import { ToolPanel } from "./ToolPanel";

export class Manager {
  public rect: Rect = { left: 0, top: 0, right: 0, bottom: 0 };

  public user: string;

  public activeLayer: Layer | null = null;

  public activeObserver: Observer | null = null;

  public offset: Point = { x: 0, y: 0 };

  public toolPanel: ToolPanel;

  public observers: Observer[] = [];

  public layers: Record<string, Layer> = {};

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

  private _reducers: ((m: Manager, s: RedrawState, a: Action) => void)[] = [];

  addReducer(reducer: (m: Manager, s: RedrawState, a: Action) => void) {
    this._reducers.push(reducer);
  }

  constructor(user: string, private _container: HTMLDivElement) {
    this.user = user;

    this.activeObserver = this.createObserver(user);
    this._drawer = new Drawer(this._container);
    this.toolPanel = new ToolPanel(this);

    this.update = this.update.bind(this);
    this.onResize = this.onResize.bind(this);

    this.onResize();
    this._drawer.updateRect(this.rect);

    this.createLayer("preview", 100000);
    this.setActiveLayer(this.createLayer(undefined).id);
  }

  update(ts: number) {
    window.requestAnimationFrame(this.update);

    if (ts - this._prevTS < 1) return;

    this._prevTS = ts;

    const internal = RedrawState.filter(this._actions.internal.pending);
    const external = RedrawState.filter(this._actions.external.pending);

    this._actions.internal.history.push(...internal);
    this._actions.internal.pending = [];
    this._actions.external.pending = [];

    const state = this.getRedrawState([...internal, ...external]);

    if (!state) return;

    for (const [layerId, changes] of state.getChanges()) {
      const layer = this.layers[layerId];
      const scratches = layer.scratches;
      const isFull = changes.isFull || changes.resize;

      this._drawer.draw(layerId, isFull, (drawer, imageData) => {
        const rects = isFull ? [drawer.rect] : changes.redraw;
        if (changes.resize) drawer.resize(layerId);

        // somehow rects should collapse if they on each other so we dont go through same scratches twice
        // mb check percentage of one rect taking place in another rect
        for (const rect of rects) {
          drawer.clear(imageData, rect);

          for (const scratch of scratches) {
            if (!scratch.isIntersectsRect(rect)) continue;
            scratch.draw(imageData, drawer, rect);
          }
        }

        for (const scratchId of changes.add) {
          const scratch = layer.getScratch(scratchId);
          if (!scratch) continue;
          if (!scratch.isIntersectsRect(drawer.rect)) continue;
          scratch.draw(imageData, drawer);
        }

        return imageData;
      });
    }
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
    this.layers[layer.id] = layer;
    this._drawer.addLayer(layer.id, z);
    return layer;
  }

  setActiveLayer(layerId: string) {
    if (!this.layers[layerId]) return;
    this.activeLayer = this.layers[layerId];
  }

  move(observerId: string, x: number, y: number) {
    const observer = this.observers.find((o) => o.id === observerId);
    if (!observer) return;
    observer.move(x, y);
    if (this.activeObserver === observer) this.onResize();
  }

  updateDrawerRect() {
    return this._drawer.updateRect(this.rect);
  }

  private onResize() {
    const width = this._container.clientWidth;
    const height = this._container.clientHeight;

    this.offset = {
      x: this._container.offsetLeft,
      y: this._container.offsetTop,
    };

    this.rect.right = this.rect.left + width;
    this.rect.bottom = this.rect.top + height;

    if (this.activeObserver) {
      const center = this.activeObserver.center;
      this.rect.left = center.x - Math.floor(width / 2);
      this.rect.right = this.rect.left + width;
      this.rect.top = center.y - Math.floor(height / 2);
      this.rect.bottom = this.rect.top + height;
    }
  }

  private listenResize() {
    window.addEventListener("resize", this.onResize);
  }

  private unlistenResize() {
    window.removeEventListener("resize", this.onResize);
  }

  private getRedrawState(actions: Action[]) {
    if (!actions.length) return;

    const state = new RedrawState();

    for (const a of actions) {
      for (const r of this._reducers) {
        r(this, state, a);
      }
    }

    for (const [layerId, changes] of state.getChanges()) {
      for (const scratchId of Object.keys(changes.changed)) {
        const layer = this.layers[layerId];
        if (!layer.hasScratchesAbove(scratchId)) {
          state.addNewScratchToDraw(layerId, scratchId);
        } else {
          const scratch = layer.getScratch(scratchId);
          if (!scratch) continue;
          state.addRectToRedraw(layerId, scratch.rect);
        }
      }
    }

    return state;
  }
}
