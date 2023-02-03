import { LayerManager } from '../../../plugins/drawer/';
import { reactive } from 'vue';

export class LayerManagerVue extends LayerManager {
  public order: string[] = reactive([]);

  public clear() {
    this.layers = {};
    this.order = reactive([]);
  }
}
