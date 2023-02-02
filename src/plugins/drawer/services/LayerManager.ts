import { Layer } from '../entities/Layer';

export class LayerManager {
  public active?: string;

  public order: string[] = [];

  private layers: Record<string, Layer> = {};

  private _callbacks: Record<'add' | 'remove', ((layerId: string) => void)[]> =
    { add: [], remove: [] };

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

  getActive() {
    if (!this.active) return undefined;
    return this.get(this.active);
  }

  get(id: string): Layer | undefined {
    return this.layers[id];
  }

  remove(layerId: string) {
    if (layerId === 'preview') return;

    const index = this.order.findIndex((l) => l === this.active);
    this.order.splice(index);
    delete this.layers[layerId];
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
}
