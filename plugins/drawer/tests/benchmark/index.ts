import {
  toolReducer,
  observerReducer,
  layerReducer,
  addObserver,
  addScratch,
  ScratchState,
  createLayer,
  moveObserver,
} from '../../../drawer';
import { ManagerForBenchmark } from './ManagerWithBenchmark';

declare global {
  interface Window {
    board: ManagerForBenchmark;
  }
}

function initBoard(container: HTMLDivElement) {
  const board = new ManagerForBenchmark({ name: 'test', id: 'test' });
  board.actions.addReducer(toolReducer, observerReducer, layerReducer);
  board.setContainer(container);
  board.init();
  board.start();
  window.board = board;
}

const container = document.querySelector<HTMLDivElement>('#app');

function clearResults() {
  document.querySelectorAll('.row:not(.header)').forEach((element) => {
    element.remove();
  });
}

function showResults() {
  const benchmarkContainer =
    document.querySelector<HTMLDivElement>('#benchmark');
  if (!benchmarkContainer) return;
  benchmarkContainer.style.display = 'block';
}

function addTestResult(
  name: string,
  testResults: {
    all: number;
    diff: number;
    draw: number;
  }[]
) {
  const statsContainer = document.querySelector('.stats');
  const testHeader = document.createElement('h2');
  testHeader.textContent = name + ' results';
  statsContainer?.appendChild(testHeader);

  const calculations = testResults.reduce(
    (
      acc: Record<
        string,
        {
          type: string;
          min: number;
          max: number;
          median: number;
          sum: number;
        }
      >,
      item: any
    ) => {
      for (const k in item) {
        if (!acc[k])
          acc[k] = { sum: 0, type: k, min: Infinity, max: 0, median: 0 };
        acc[k]['sum'] += item[k];
        acc[k]['min'] = item[k] < acc[k]['min'] ? item[k] : acc[k]['min'];
        acc[k]['max'] = item[k] > acc[k]['max'] ? item[k] : acc[k]['max'];
      }
      return acc;
    },
    {}
  );

  for (const item in calculations) {
    const rowEl = document.createElement('div');
    rowEl.classList.add('row');

    const type = document.createElement('span');
    type.textContent = calculations[item]['type'];
    const count = document.createElement('span');
    count.textContent = '' + testResults.length;
    const min = document.createElement('span');
    min.textContent = '' + calculations[item]['min'];
    const avg = document.createElement('span');
    avg.textContent = '' + calculations[item]['sum'] / testResults.length;
    const max = document.createElement('span');
    max.textContent = '' + calculations[item]['max'];
    const median = document.createElement('span');
    median.textContent = '' + calculations[item]['median'];

    rowEl.append(type, count, min, avg, max, median);
    statsContainer?.appendChild(rowEl);
  }
}

function testFewScratches() {
  const board = window.board;
  board.clear();
  board.init();
  board.actions.dispatch(createLayer('preview', 100000, {}));
  board.actions.dispatch(createLayer('main', 1, {}));
  board.actions.dispatch(addObserver('test', { name: 'test' }));

  const startTest = () => {
    board.clearTests();
    let i = 0;
    const handler = setInterval(() => {
      board.actions.dispatch(
        moveObserver('test', {
          x: 10 * (i % 2 === 0 ? -1 : 1),
          y: 10 * (i % 2 !== 0 ? -1 : 1),
        })
      );
      i++;
      if (i === 500) {
        addTestResult('Few Scratches', board.tests);
        showResults();
        clearInterval(handler);
      }
    }, 20);
  };

  setTimeout(() => {
    board.layers.setActive('main');
    board.users.setActive('test');
    let i = 0;
    let interval = setInterval(() => {
      board.actions.dispatch(
        addScratch(
          `test-${i * 1}`,
          {
            tool: 'LineTool',
            thickness: 3,
            color: {
              r: Math.random() * 255,
              g: Math.random() * 255,
              b: Math.random() * 255,
              a: 200 + Math.random() * 55,
            },
            state: ScratchState.active,
            start: { x: -40 + 1 * i, y: 420 },
            end: { x: -40 + 1 * i, y: 1580 },
          },
          'main'
        )
      );
      i++;
      if (i > 2000 / 1) {
        clearInterval(interval);
        startTest();
      }
    }, 1);
  }, 500);
}

const startBtn = document.querySelector('#start');
startBtn?.addEventListener('click', function () {
  if (container) {
    initBoard(container);
    testFewScratches();
  }
  const warningBlock = document.querySelector('#warning');
  if (warningBlock) warningBlock.style.display='none';
});
