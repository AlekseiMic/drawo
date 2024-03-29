/* eslint-disable no-unused-vars */
import { CanvasManager } from './CanvasManager';
import { Point, ScratchState } from '../interfaces';
import { Rect } from '../interfaces/Rect';
import { LayerManager } from './LayerManager';
import { UserManager } from './UserManager';
import { ToolManager } from './ToolManager';
import { ScratchStore } from './ScratchStore';
import { ActionManager } from './ActionManager';
import { BaseRedrawState, Layer } from '../entities';
import { RefreshService } from './RefreshService';
import { DrawService } from './DrawService';
import { SettingsStore } from './SettingsStore';

const defaultComponents = {
  users: UserManager,
  tools: ToolManager,
  layers: LayerManager,
  scratches: ScratchStore,
  actions: ActionManager,
};

export class Manager {
  // Canvas visible rect
  public rect: Rect = { left: 0, top: 0, right: 0, bottom: 0 };

  // Container html offset
  public offset: Point = { x: 0, y: 0 };

  // Current user
  public user: { id: string; name: string };

  //
  //
  //
  public users: UserManager;

  public tools: ToolManager;

  public layers: LayerManager;

  public scratches: ScratchStore;

  public actions: ActionManager;

  public settings = new SettingsStore();

  //
  //
  //
  protected _refresh = new RefreshService();

  protected _canvases = new CanvasManager();

  protected _drawService: DrawService;

  protected _container?: HTMLDivElement;

  serialize() {
    return {
      users: this.users.serialize(),
      layers: this.layers.serialize(),
      scratches: this.scratches.serialize(),
      actions: this.actions.serialize(),
      settings: this.settings.serialize(),
    };
  }

  deserialize(data: any) {
    this.users.deserialize(data.users);
    this.layers.deserialize(data.layers);
    this.scratches.deserialize(data.scratches);
    this.actions.deserialize(data.actions);
    this.settings.deserialize(data.settings);
  }

  constructor(
    user: { id: string; name: string },
    options?: { components?: Partial<typeof defaultComponents> }
  ) {
    this.user = user;

    this.update = this.update.bind(this);
    this.onResize = this.onResize.bind(this);
    this.onUserChange = this.onUserChange.bind(this);
    this.onUserMove = this.onUserMove.bind(this);
    this.onLayerAdd = this.onLayerAdd.bind(this);
    this.onLayerRemove = this.onLayerRemove.bind(this);

    const components = { ...defaultComponents, ...options?.components };
    this._drawService = new DrawService(this._canvases, this.settings);
    this.users = new components.users();
    this.tools = new components.tools(this);
    this.layers = new components.layers();
    this.scratches = new components.scratches();
    this.actions = new components.actions(this);
  }

  clear() {
    this.users.clear();
    this.layers.clear();
    this.scratches.clear();
    this.actions.clear();
    this._canvases.clear();
    this.tools.setActive(undefined);
  }

  init() {
    this.clear();

    if (this._container) {
      this.onResize();
      this._canvases.updateRect(this.rect);
      this.layers.subscribeOnLayerAdd(this.onLayerAdd);
      this.layers.subscribeOnLayerRemove(this.onLayerRemove);
      this.users.subscribeOnUserChange(this.onUserChange);
      this.users.subscribeOnUserMove(this.onUserMove);
    }

    this._refresh.setUpdateCallback(this.update);
  }

  start() {
    this.listenResize();
    this._refresh.start();
  }

  stop() {
    this.unlistenResize();
    this._refresh.stop();
  }

  setContainer(container: HTMLDivElement) {
    this._container = container;
    this._canvases.setContainer(container);
  }

  private onUserMove(userId?: string) {
    if (this.users.active === userId) {
      this.onResize();
    }
  }

  protected onLayerAdd(layerId: string) {
    const layer = this.layers.get(layerId);
    if (layer) {
      this._canvases.add(layer.id, layer.zIndex);
    }
  }

  protected onLayerRemove(layerId: string) {
    this._canvases.remove(layerId);
  }

  protected onUserChange() {
    this.onResize();
  }

  update() {
    const state = this.actions.getPendingUpdates();
    if (!this._container) return;
    const shouldResize = this._canvases.updateRect(this.rect);
    const diff = state.getChanges(shouldResize, this.layers.order);

    for (const [layerId, changes] of diff) {
      const layer = this.layers.get(layerId);
      if (layer) {
        const isResize = shouldResize || changes.resize;
        const isFull = changes.isFull || isResize;
        this.drawLayer(layer, changes, isFull, isResize);
      }
    }
  }

  protected drawLayer(
    layer: Layer,
    changes: BaseRedrawState,
    isFull: boolean,
    resized: boolean
  ) {
    this._canvases.draw(layer.id, isFull, (cm, data) => {
      const rects = isFull ? [cm.rect] : changes.redraw;
      if (resized) cm.resize(layer.id);

      for (const rect of rects) {
        if (!resized) this._drawService.clear(data, rect);
        this.drawScratches(
          this.layers.getScratches(layer.id),
          layer.id,
          data,
          rect
        );
      }

      if (!isFull) {
        this.drawScratches(changes.add, layer.id, data, cm.rect);
      }

      return data;
    });
  }

  protected drawScratches(
    ids: string[],
    layer: string,
    imageData: ImageData,
    rect: Rect
  ) {
    for (const id of ids) {
      const scratch = this.scratches.get(id);
      const skip =
        !scratch ||
        (layer !== 'preview' && scratch.state !== ScratchState.active);
      if (skip || !scratch.isIntersectsRect(rect)) continue;
      scratch.draw(imageData, this._drawService, rect);
    }
  }

  protected onResize() {
    if (!this._container) return;
    const { x, y, height, width } = this._container.getBoundingClientRect();
    this.offset = { x, y };

    const activeUser = this.users.getActive();
    if (activeUser) {
      const center = activeUser.center;
      this.rect.left = center.x - Math.floor(width / 2);
      this.rect.top = center.y - Math.floor(height / 2);
    }

    this.rect.right = this.rect.left + width;
    this.rect.bottom = this.rect.top + height;
  }

  protected listenResize() {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.onResize);
    }
  }

  protected unlistenResize() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.onResize);
    }
  }
}
