import {
  Manager,
  LineTool,
  PenTool,
  MoveTool,
  DeleteTool,
  toolReducer,
  observerReducer,
  layerReducer,
  addObserver,
Layer,
Rect,
} from '../../../drawer';

declare global {
  interface Window {
    board: Manager;
  }
}

const container = document.querySelector<HTMLDivElement>('#app');

class ManagerWithBenchmark extends Manager {
  update() {
    const state = this.actions.getPendingUpdates();
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

  protected drawScratches(
    ids: string[],
    layer: string,
    imageData: ImageData,
    rect: Rect
  ) {
    console.time('draw');
    super.drawScratches(ids, layer,imageData, rect);
    console.timeEnd('draw');
  }
}

if (container) {
  window.board = new ManagerWithBenchmark({ name: 'test', id: 'test' });
  window.board.tools.add(LineTool, PenTool, MoveTool, DeleteTool);
  window.board.actions.addReducer(toolReducer, observerReducer, layerReducer);
  window.board.setContainer(container);
  window.board.init();
  window.board.start();
  window.board.tools.setActive('PenTool');
  window.board.actions.dispatch(addObserver('test', { name: 'test' }));
  window.board.layers.add(new Layer(100000, 'preview'));
  window.board.layers.add(new Layer(1, 'main'));
  window.board.layers.setActive('main');
}
