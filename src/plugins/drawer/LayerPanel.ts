import { Layer } from './Layer';

export class LayerPanel {
  public active: Layer | null = null;

  public layers: Record<string, Layer> = {};

  setActive(layerId: string) {
    this.active = this.layers[layerId];
  }
}
