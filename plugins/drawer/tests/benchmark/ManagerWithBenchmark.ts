import { Manager, Rect } from '../../../drawer';

export class ManagerForBenchmark extends Manager {
  tests: {
    all: number;
    diff: number;
    draw: number;
  }[] = [];

  activeTest: {
    all: number;
    diff: number;
    draw: number;
  } = {
    all: 0,
    diff: 0,
    draw: 0,
  };

  update() {
    const start = performance.now();
    this.activeTest = { all: 0, diff: 0, draw: 0 };
    const state = this.actions.getPendingUpdates();
    const shouldResize = this._canvases.updateRect(this.rect);
    const diff = state.getChanges(shouldResize, this.layers.order);
    this.activeTest.diff = performance.now() - start;

    for (const [layerId, changes] of diff) {
      const layer = this.layers.get(layerId);
      if (layer) {
        const isResize = shouldResize || changes.resize;
        const isFull = changes.isFull || isResize;
        this.drawLayer(layer, changes, isFull, isResize);
      }
    }
    this.activeTest.all = performance.now() - start;
    if (diff.length) this.tests.push(this.activeTest);
  }

  protected drawScratches(
    ids: string[],
    layer: string,
    imageData: ImageData,
    rect: Rect
  ) {
    const start = performance.now();
    super.drawScratches(ids, layer, imageData, rect);
    if (layer === 'main') this.activeTest.draw = performance.now() - start;
  }

  clearTests() {
    this.tests = [];
  }
}
