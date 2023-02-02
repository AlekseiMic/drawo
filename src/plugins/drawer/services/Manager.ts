/* eslint-disable no-unused-vars */
import { CanvasManager } from './CanvasManager';
import { Point, ScratchState } from '../interfaces';
import { Rect } from '../interfaces/Rect';
import { LayerManager } from './LayerManager';
import { UserManager } from './UserManager';
import { ToolManager } from './ToolManager';
import { ScratchStore } from './ScratchStore';
import { ActionManager } from './ActionManager';
import { Layer, User } from '../entities';
import { RefreshService } from './RefreshService';
import { DrawService } from './DrawService';
import { SettingsStore } from './SettingsStore';

const defaultComponents = {
  users: UserManager,
  tools: ToolManager,
  layers: LayerManager,
  scratches: ScratchStore,
};

export class Manager {
  // Canvas visible rect
  public rect: Rect = { left: 0, top: 0, right: 0, bottom: 0 };

  // Container html offset
  public offset: Point = { x: 0, y: 0 };

  // Current user
  public user: string;

  // All who can draw
  public users: UserManager;

  public tools: ToolManager;

  public layers: LayerManager;

  public scratches: ScratchStore;

  public actions = new ActionManager(this);

  public settings = new SettingsStore();

  private _refresh = new RefreshService();

  private _drawer = new CanvasManager();

  private _drawService: DrawService;

  private _container: HTMLDivElement;

  constructor(
    user: string,
    container: HTMLDivElement,
    options?: { components?: typeof defaultComponents }
  ) {
    this.user = user;

    this.update = this.update.bind(this);
    this.onResize = this.onResize.bind(this);
    this.onUserChange = this.onUserChange.bind(this);
    this.onUserMove = this.onUserMove.bind(this);
    this.onLayerAdd = this.onLayerAdd.bind(this);
    this.onLayerRemove = this.onLayerRemove.bind(this);

    this._container = container;
    this._drawer.setContainer(container);

    this._drawService = new DrawService(this._drawer, this.settings);

    const components = { ...defaultComponents, ...options?.components };

    this.users = new components.users();
    this.tools = new components.tools(this);
    this.layers = new components.layers();
    this.scratches = new components.scratches();
  }

  init() {
    this.onResize();
    this._drawer.updateRect(this.rect);

    // layers settings
    this.layers.subscribeOnLayerAdd(this.onLayerAdd);
    this.layers.subscribeOnLayerRemove(this.onLayerRemove);
    this.layers.add(new Layer(100000, 'preview'));
    this.layers.add(new Layer(1, 'main'));
    this.layers.setActive('main');

    // user settings
    this.users.subscribeOnUserChange(this.onUserChange);
    this.users.subscribeOnUserMove(this.onUserMove);
    this.users.add(new User(this.user));
    this.users.setActive(this.user);

    // requestAnimationFrame
    this._refresh.setUpdateCallback(this.update);
  }

  private onUserMove(userId?: string) {
    if (this.users.active === userId) this.onResize();
  }

  private onLayerAdd(layerId: string) {
    const layer = this.layers.get(layerId);
    if (!layer) return;
    this._drawer.add(layer.id, layer.zIndex);
  }

  private onLayerRemove(layerId: string) {
    this._drawer.remove(layerId);
  }

  private onUserChange() {
    this.onResize();
  }

  start() {
    this.listenResize();
    this._refresh.start();
  }

  stop() {
    this.unlistenResize();
    this._refresh.stop();
  }

  update() {
    const state = this.actions.getPendingUpdates();
    const resized = this._drawer.updateRect(this.rect);

    if (!state && !resized) return;

    const diff = resized
      ? this.layers.order.map((l) => {
          return [
            l,
            { resize: true, isFull: true, redraw: [], changed: {}, add: [] },
          ] as const;
        })
      : state!.getChanges();

    for (const [layerId, changes] of diff) {
      const layer = this.layers.get(layerId);
      if (!layer) return; // probably should remove layer or smth
      const scratches = layer.scratches;
      const isFull = changes.isFull || changes.resize;

      this._drawer.draw(layerId, isFull, (canvasManager, imageData, rect) => {
        const rects = isFull ? [rect] : changes.redraw;
        if (changes.resize) canvasManager.resize(layerId);

        // somehow rects should collapse if they on each other so we dont go through same scratches twice
        // mb check percentage of one rect taking place in another rect
        for (const rect of rects) {
          if (!changes.resize) this._drawService.clear(imageData, rect);

          for (const scratchId of scratches) {
            const scratch = this.scratches.get(scratchId);
            if (
              !scratch ||
              (layerId !== 'preview' && scratch.state !== ScratchState.active)
            )
              continue;
            if (!scratch.isIntersectsRect(rect)) continue;
            scratch.draw(imageData, this._drawService, rect);
          }
        }

        for (const scratchId of changes.add) {
          const scratch = this.scratches.get(scratchId);
          if (
            !scratch ||
            (layerId !== 'preview' && scratch.state !== ScratchState.active)
          )
            continue;
          if (!scratch.isIntersectsRect(rect)) continue;
          scratch.draw(imageData, this._drawService);
        }

        return imageData;
      });
    }
  }

  private onResize() {
    if (!this._container) return;
    const width = this._container.clientWidth;
    const height = this._container.clientHeight;

    this.offset = this._container.getBoundingClientRect();

    this.rect.right = this.rect.left + width;
    this.rect.bottom = this.rect.top + height;

    const activeUser = this.users.getActive();
    if (activeUser) {
      const center = activeUser.center;
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
}
