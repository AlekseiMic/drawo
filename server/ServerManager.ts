import {
  Layer,
  Manager,
  layerReducer,
  toolReducer,
  observerReducer,
} from '../src/plugins/drawer/';
import { ServerActionManager } from './ServerActionManager';

export class ServerManager extends Manager {
  constructor() {
    super(
      { id: 'server', name: 'server' },
      { components: { actions: ServerActionManager } }
    );
    this.actions.addReducer(layerReducer, toolReducer, observerReducer);
    this.init();
  }

  init() {
    this.clear();
    this.layers.add(new Layer(100000, 'preview'));
    this.layers.add(new Layer(1, 'main'));
  }

  update() {}
}
