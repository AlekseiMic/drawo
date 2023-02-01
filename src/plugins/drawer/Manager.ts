/* eslint-disable no-unused-vars */
import { Drawer } from './Drawer';
import { Point, ScratchState } from './interfaces';
import { Action } from './interfaces/Action';
import { Rect } from './interfaces/Rect';
import { Layer } from './Layer';
import { LayerPanel } from './LayerPanel';
import { Observer } from './Observer';
import { ObserverPanel } from './ObserverPanel';
import { RedrawState } from './RedrawState';
import { ToolPanel } from './ToolPanel';

type Actions = {
  history: Action[];
  pending: Action[];
};

type Reducer = (m: Manager, s: RedrawState, a: Action) => void;

export class Manager {
  public rect: Rect = { left: 0, top: 0, right: 0, bottom: 0 };

  public offset: Point = { x: 0, y: 0 };

  public observers = new ObserverPanel();

  public toolPanel = new ToolPanel(this);

  public layers = new LayerPanel();

  private _drawer?: Drawer;

  private _prevTS: number = 0;

  private _stopped = false;

  private _actions: Record<'internal' | 'external', Actions> = {
    internal: { history: [], pending: [] },
    external: { history: [], pending: [] },
  };

  private _reducers: ((m: Manager, s: RedrawState, a: Action) => void)[] = [];

  private _container?: HTMLDivElement;

  constructor(public user: string) {
    this.update = this.update.bind(this);
    this.onResize = this.onResize.bind(this);
  }

  init() {
    if (!this._container) return;
    this._drawer = new Drawer(this._container);
    this.onResize();
    this._drawer.updateRect(this.rect);
    this.createLayer(100000, 'preview');
    const main = this.createLayer(
      Object.keys(this.layers.layers).length,
      'main'
    );
    this.layers.setActive(main.id);
  }

  getActionHistory() {
    return this._actions.internal.history;
  }

  clearActionHistory() {
    this._actions.internal.history = [];
  }

  start() {
    this.listenResize();
    window.requestAnimationFrame(this.update);
  }

  stop() {
    this.unlistenResize();
    this._stopped = true;
  }

  end() {
    this.unlistenResize();
  }

  setContainer(container: HTMLDivElement) {
    this._container = container;
  }

  setObserver(observer: Observer) {
    const shouldResize = this.observers.active !== observer;
    this.observers.active = observer;
    if (shouldResize) this.onResize();
  }

  addReducer(reducer: Reducer) {
    this._reducers.push(reducer);
  }

  addReducers(...reducers: Reducer[]) {
    reducers.forEach((reducer) => this.addReducer(reducer));
  }

  update(ts: number) {
    if (this._stopped) return;

    window.requestAnimationFrame(this.update);

    if (ts - this._prevTS < 5) return;

    this._prevTS = ts;

    const internal = RedrawState.filter(this._actions.internal.pending);
    const external = RedrawState.filter(this._actions.external.pending);

    this._actions.internal.history.push(...internal);
    this._actions.internal.pending = [];
    this._actions.external.pending = [];

    const state = this.getRedrawState([...internal, ...external]);

    const resized = this._drawer?.updateRect(this.rect);
    if (!(state || resized)) return;

    const diff = resized
      ? Object.entries(this.layers?.layers ?? {}).map((l) => {
          return [
            l[0],
            { resize: true, isFull: true, redraw: [], changed: {}, add: [] },
          ] as const;
        })
      : state!.getChanges();

    for (const [layerId, changes] of diff) {
      const layer = this.layers!.layers[layerId];
      const scratches = layer.scratches;
      const isFull = changes.isFull || changes.resize;

      this._drawer!.draw(layerId, isFull, (drawer, imageData) => {
        const rects = isFull ? [drawer.rect] : changes.redraw;
        if (changes.resize) drawer.resize(layerId);

        // somehow rects should collapse if they on each other so we dont go through same scratches twice
        // mb check percentage of one rect taking place in another rect
        for (const rect of rects) {
          if (!changes.resize) drawer.clear(imageData, rect);

          for (const scratchId of scratches) {
            const scratch = layer.getScratch(scratchId);
            if (
              !scratch ||
              (layerId !== 'preview' && scratch.state !== ScratchState.active)
            )
              continue;
            if (!scratch.isIntersectsRect(rect)) continue;
            scratch.draw(imageData, drawer, rect);
          }
        }

        for (const scratchId of changes.add) {
          const scratch = layer.getScratch(scratchId);
          if (
            !scratch ||
            (layerId !== 'preview' && scratch.state !== ScratchState.active)
          )
            continue;
          if (!scratch.isIntersectsRect(drawer.rect)) continue;
          scratch.draw(imageData, drawer);
        }

        return imageData;
      });
    }
  }

  removeScratch(layerId: string, scratchId: string) {
    this.dispatch({
      layerId,
      id: scratchId,
      type: 'removeScratch',
      payload: {},
    });
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

  createLayer(z?: number, id?: string) {
    let zIndex = z;
    if (!zIndex) {
      const layer = this.layers.layersOrdered[1];
      zIndex = (this.layers.layers[layer]?.zIndex ?? 0) + 1;
    }
    const layer = new Layer(zIndex, id);
    this.layers!.layers[layer.id] = layer;
    this._drawer!.addLayer(layer.id, z);
    return layer;
  }

  move(observerId: string, x: number, y: number) {
    const observer = this.observers.observers.find((o) => o.id === observerId);
    if (!observer) return;
    observer.move(x, y);
    if (this.observers.active === observer) this.onResize();
  }

  updateDrawerRect() {
    return this._drawer!.updateRect(this.rect);
  }

  removeLayer(id: string) {
    this._drawer!.removeLayer(id);
    this.layers.remove(id);
  }

  private onResize() {
    if (!this._container) return;
    const width = this._container.clientWidth;
    const height = this._container.clientHeight;

    this.offset = {
      x: this._container.offsetLeft,
      y: this._container.offsetTop,
    };

    this.rect.right = this.rect.left + width;
    this.rect.bottom = this.rect.top + height;

    if (this.observers.active) {
      const center = this.observers.active.center;
      this.rect.left = center.x - Math.floor(width / 2);
      this.rect.right = this.rect.left + width;
      this.rect.top = center.y - Math.floor(height / 2);
      this.rect.bottom = this.rect.top + height;
    }
  }

  private listenResize() {
    window.addEventListener('resize', this.onResize);
  }

  private unlistenResize() {
    window.removeEventListener('resize', this.onResize);
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
        const layer = this.layers!.layers[layerId];
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
