const startBtn = document.querySelector('#start');

let cb: () => void | undefined;
const block = document.querySelector<HTMLDivElement>('#warning');

const warningBlock = {
  show() {
    if (!block) return;
    block.style.display = 'flex';
  },
  hide() {
    if (!block) return;
    block.style.display = 'none';
  },
  setAcceptCallback(callback: () => void) {
    cb = callback;
  },
};

startBtn?.addEventListener('click', function () {
  warningBlock.hide();
  if (cb) cb();
});

export default warningBlock;
