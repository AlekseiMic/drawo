import { ScratchState } from '../../../';
import { addScratch, moveObserver } from '../../../';
import { ManagerForBenchmark } from '../ManagerWithBenchmark';

export default {
  name: 'Few Scratches',
  async run(board: ManagerForBenchmark) {
    return new Promise<boolean>((resolve) => {
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
          clearInterval(handler);
          resolve(true);
        }
      }, 20);
    });
  },
  async prepare(board: ManagerForBenchmark) {
    return new Promise<boolean>((resolve) => {
      let i = 0;
      let interval = setInterval(() => {
        board.actions.dispatch(
          addScratch(
            `test-${i * 1}`,
            {
              tool: 'LineTool',
              thickness: 1,
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
          resolve(true);
        }
      }, 1);
    });
  },
};
