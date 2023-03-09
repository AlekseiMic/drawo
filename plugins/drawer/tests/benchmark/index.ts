import runner from './TestRunner';
import fewScratchesTest from './tests/FewScratches';
import warningBlock from './WarningBlock';

const container = document.querySelector<HTMLDivElement>('#app');

warningBlock.setAcceptCallback(() => {
  runner.init(container);
  runner.addTest(fewScratchesTest);
  runner.run();
});
warningBlock.show();
