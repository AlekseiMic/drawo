import { reactive } from 'vue';
import { Layer } from './Layer';

export class LayerPanel {
  public active: string | null = null;

  public layers: Record<string, Layer> = {};

  // only for vue
  public activeScratchesRef: { value: string[] } = { value: [] };

  get layersOrdered(): Layer[] {
    return Object.values(this.layers).sort((l1, l2) => l2.zIndex - l1.zIndex);
  }

  setActive(layerId: string) {
    if (this.layers[layerId]) {
      this.layers[layerId]._sorted = reactive(this.layers[layerId]._sorted);
      this.activeScratchesRef.value = this.layers[layerId]._sorted;
      this.active = layerId;
    }
  }

  getActive() {
    if (!this.active) return undefined;
    return this.layers[this.active];
  }
}
