import { ManagerForBenchmark } from './ManagerWithBenchmark';
import {
  toolReducer,
  observerReducer,
  layerReducer,
  addObserver,
  createLayer,
} from '../../';
import statsWindow from './StatsWindow';

let board: ManagerForBenchmark | null = null;
let tests: {
  name: string;
  run: (board: ManagerForBenchmark) => Promise<boolean>;
  prepare: (board: ManagerForBenchmark) => Promise<boolean>;
}[] = [];

const TestRunner = {
  init(container: null | HTMLDivElement) {
    if (!container) return;
    board = new ManagerForBenchmark({ name: 'test', id: 'test' });
    board.actions.addReducer(toolReducer, observerReducer, layerReducer);
    board.setContainer(container);
  },
  addTest(test: (typeof tests)[number]) {
    tests.push(test);
  },
  async run() {
    if (!board) return;
    try {
      statsWindow.clear();
      for (const test of tests) {
        await this.clear();
        await test.prepare(board);
        board.clearTests();
        await test.run(board);
        statsWindow.addResults(test.name, board.tests);
      }
      statsWindow.show();
    } catch (err) {
      console.error(err);
    }
  },
  async clear() {
    return new Promise((resolve, reject) => {
      if (!board) return reject('not initialized');
      board.stop();
      board.clear();
      board.clearTests();
      board.init();
      board.actions.dispatch(createLayer('preview', 100000, {}));
      board.actions.dispatch(createLayer('main', 1, {}));
      board.actions.dispatch(addObserver('test', { name: 'test' }));
      board.start();

      setTimeout(() => {
        board!.layers.setActive('main');
        board!.users.setActive('test');
        resolve(true);
      }, 100);
    });
  },
};

export default TestRunner;
