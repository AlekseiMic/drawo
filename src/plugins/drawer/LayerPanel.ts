import { Layer } from './Layer';

export class LayerPanel {
  public active: Layer | null = null;

  public layers: Record<string, Layer> = {};

  get layersOrdered(): Layer[] {
    return Object.values(this.layers).sort((l1, l2) => l2.zIndex - l1.zIndex);
  }

  setActive(layerId: string) {
    this.active = this.layers[layerId];
  }
}
