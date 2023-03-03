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
} from '../../../../drawer';

declare global {
  interface Window {
    board: Manager;
  }
}

const container = document.querySelector<HTMLDivElement>('#app');
if (container) {
  window.board = new Manager({ name: 'test', id: 'test' });
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
