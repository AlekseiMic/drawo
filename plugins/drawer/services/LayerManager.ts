import { IRawLayer, Layer } from '../entities/Layer';

export class LayerManager {
  public active?: string;

  public order: string[] = [];

  protected layers: Record<string, Layer> = {};

  protected scratchesPerLayer: Record<string, string[]> = {};

  protected _callbacks: Record<
    'add' | 'remove',
    ((layerId: string) => void)[]
  > = { add: [], remove: [] };

  serialize(): {
    layers: Record<IRawLayer['id'], IRawLayer>;
    scratchesPerLayer: Record<IRawLayer['id'], string[]>;
  } {
    return {
      layers: this.layers,
      scratchesPerLayer: this.scratchesPerLayer,
    };
  }

  deserialize(data?: {
    layers?: Record<string, Layer>;
    scratchesPerLayer?: Record<string, string[]>;
  }) {
    Object.values(data?.layers ?? {}).forEach((l: Layer) => {
      this.add(l);
    });
    this.scratchesPerLayer = data?.scratchesPerLayer ?? {};
  }

  clear() {
    this.layers = {};
    this.order = [];
    this._callbacks = { add: [], remove: [] };
  }

  subscribeOnLayerAdd(cb: (typeof this._callbacks)['add'][0]) {
    this._callbacks.add.push(cb);
  }

  unsubscribeOnLayerAdd(cb: (typeof this._callbacks)['add'][0]) {
    this._callbacks.add = this._callbacks.add.filter(
      (storedCb) => cb !== storedCb
    );
  }

  subscribeOnLayerRemove(cb: (typeof this._callbacks)['remove'][0]) {
    this._callbacks.remove.push(cb);
  }

  unsubscribeOnLayerRemove(cb: (typeof this._callbacks)['remove'][0]) {
    this._callbacks.remove = this._callbacks.remove.filter(
      (storedCb) => cb !== storedCb
    );
  }

  setActive(layerId?: string) {
    if (layerId === 'preview') return;
    this.active = layerId;
  }

  add(layer: Layer) {
    this.layers[layer.id] = layer;
    this.sort();
    this._callbacks.add.forEach((cb) => cb(layer.id));
  }

  getMaxZIndex() {
    return this.get(this.order[1])?.zIndex || 0;
  }

  getActive() {
    if (!this.active) return undefined;
    return this.get(this.active);
  }

  get(id: string): Layer | undefined {
    return this.layers[id];
  }

  remove(layerId: string) {
    if (layerId === 'preview') return;

    const index = this.order.findIndex((l) => l === layerId);
    if (index === -1) return;
    this.order.splice(index, 1);
    delete this.layers[layerId];
    delete this.scratchesPerLayer[layerId];
    this._callbacks.remove.forEach((cb) => cb(layerId));

    if (layerId !== this.active) return;

    const next = this.order[index] ?? this.order[index - 1];
    this.setActive(next && next !== 'preview' ? next : undefined);
  }

  private sort() {
    this.order = Object.values(this.layers)
      .sort((l1, l2) => l2.zIndex - l1.zIndex)
      .map((layer) => layer.id);
  }

  getScratches(layerId: string) {
    return this.scratchesPerLayer[layerId] ?? [];
  }

  addScratch(layerId: string, scratchId: string) {
    if (!this.scratchesPerLayer[layerId]) {
      this.scratchesPerLayer[layerId] = [];
    }
    this.scratchesPerLayer[layerId]?.push(scratchId);
  }

  removeScratch(layerId: string, scratchId: string) {
    this.scratchesPerLayer[layerId] = this.scratchesPerLayer[layerId].filter(
      (s) => s !== scratchId
    );
  }
  isScratchOnTop(layerId: string, scratchId: string) {
    const countInLayer = this.scratchesPerLayer[layerId]?.length ?? 0;
    return this.scratchesPerLayer[layerId]?.[countInLayer - 1] !== scratchId;
  }
}
