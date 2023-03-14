import {
  addScratch,
  Layer,
  layerReducer,
  LineScratch,
  Manager,
  observerReducer,
  PenScratch,
  ScratchState,
  toolReducer,
} from '@plugins/drawer';
import { expect } from 'chai';

function initBoard() {
  const m = new Manager({ name: 'test', id: 'test' });
  m.actions.addReducer(toolReducer, observerReducer, layerReducer);
  m.layers.add(new Layer(1, 'main'));
  m.layers.setActive('main');
  m.init();
  return m;
}

describe('Actions', () => {
  describe('Scratches', () => {
    let m: Manager;

    beforeEach(() => {
      m = initBoard();
    });

    describe('Add', () => {
      it('Pen', () => {
        m.actions.dispatch(
          addScratch(
            'test',
            {
              color: '#335533',
              thickness: 5,
              state: ScratchState.preview,
              tool: 'PenTool',
              point: { x: 0, y: 0 },
            },
            'main'
          )
        );
        m.update();

        const scratch = m.scratches.get('test') as PenScratch;
        expect(scratch.getName()).to.be.equal('PenScratch');
        expect(scratch).to.be.instanceof(PenScratch);
        expect(scratch.thickness).to.be.equal(5);
        expect(scratch.color).to.be.equal('#335533');
        expect(scratch.state).to.be.equal(ScratchState.preview);
        expect(scratch.rect).to.be.deep.equal({
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        });
        expect(m.layers.getScratches('main').length).to.be.equal(1);
      });

      it('Line', () => {
        m.actions.dispatch(
          addScratch(
            'test',
            {
              tool: 'LineTool',
              color: '#335533',
              thickness: 5,
              state: ScratchState.preview,
              start: { x: 0, y: 0 },
              end: { x: 5, y: 5 },
            },
            'main'
          )
        );
        m.update();

        const scratch = m.scratches.get('test') as LineScratch;
        expect(scratch.getName()).to.be.equal('LineScratch');
        expect(scratch).to.be.instanceof(LineScratch);
        expect(scratch.thickness).to.be.equal(5);
        expect(scratch.color).to.be.equal('#335533');
        expect(scratch.state).to.be.equal(ScratchState.preview);
        expect(scratch.rect).to.be.deep.equal({
          top: 0 - scratch.thickness,
          left: 0 - scratch.thickness,
          right: 5 + 2 * scratch.thickness,
          bottom: 5 + 2 * scratch.thickness,
        });
        expect(m.layers.getScratches('main').length).to.be.equal(1);
      });
    });

    describe('Change', () => {
      it('Pen');
      it('Line');
    });

    describe('Start draging', () => {
      it('Pen');
      it('Line');
    });

    describe('Drop', () => {
      it('Pen');
      it('Line');
    });

    describe('Hover', () => {
      it('Pen');
      it('Line');
    });

    describe('Unhover', () => {
      it('Pen');
      it('Line');
    });

    describe('Translate', () => {
      it('Pen');
      it('Line');
    });

    describe('Remove', () => {
      it('Pen');
      it('Line');
    });
  });

  describe('Layers', () => {});

  describe('Users', () => {});
});
