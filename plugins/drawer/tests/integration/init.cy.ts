import { createLayer, Manager, removeLayer } from '../../../drawer';
import { expect } from 'chai';

declare global {
  interface Window {
    board: Manager;
  }
}

beforeEach(() => {
  cy.visit('http://localhost:4320');
});

describe('Page', () => {
  describe('Canvas', () => {
    it('exists', () => {
      cy.get('body').then(($body) => {
        expect($body.find('#app canvas').length).to.be.gte(1);
      });
    });
    it('takes full height', () => {
      cy.get('body').then(($body) => {
        const canvas = $body.find('#app canvas:first-child');
        expect($body.height()).to.be.equal(canvas.height());
      });
    });

    it('takes full width', () => {
      cy.get('body').then(($body) => {
        const canvas = $body.find('#app canvas:first-child');
        expect($body.width()).to.be.equal(canvas.width());
      });
    });
  });
});

describe('Tools', () => {
  describe('PenTool', () => {
    it('draws scratch', () => {
      cy.window().then((w) => {
        w.board.tools.setActive('PenTool');
      });

      cy.get('#app')
        .trigger('mousedown', { x: 0, y: 0 })
        .trigger('mousemove', { clientX: 1, clientY: 1 })
        .trigger('mouseup', { clientX: 100, clientY: 600 });

      cy.window().then((w) => {
        const scratches = w.board.scratches.serialize();
        expect(scratches.length).to.be.equal(1);
        expect(scratches[0].name).to.be.equal('PenScratch');
      });
    });
  });

  describe('LineTool', () => {
    it('draws scratch', () => {
      cy.window().then((w) => {
        w.board.tools.setActive('LineTool');
      });

      cy.get('#app')
        .trigger('mousedown', { x: 0, y: 0 })
        .trigger('mousemove', { clientX: 0, clientY: 0 })
        .trigger('mouseup', { clientX: 1000, clientY: 660 });

      cy.window().then((w) => {
        const scratches = w.board.scratches.serialize();
        expect(scratches.length).to.be.equal(1);
        expect(scratches[0].name).to.be.equal('LineScratch');
      });
    });
  });

  describe('MoveTool', () => {
    for (const tool of ['PenTool', 'LineTool']) {
      it(`hovers on ${tool}'s scratch`, () => {
        cy.window().then((w) => {
          w.board.tools.setActive(tool);
        });

        cy.get('#app')
          .trigger('mousedown', { x: 0, y: 0 })
          .trigger('mousemove', { clientX: 1, clientY: 1 })
          .trigger('mouseup', { clientX: 500, clientY: 500 });

        cy.window().then((w) => {
          w.board.tools.setActive('MoveTool');
        });

        // waiting for requestAnimationFrame
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.get('#app')
          .trigger('mousemove', { clientX: 100, clientY: 100 })
          .wait(20)
          .window()
          .then((w) => {
            expect(w.board.layers.getScratches('preview').length).to.be.equal(
              1
            );
          });
      });
      it(`moves ${tool}'s scratch`, () => {
        cy.window().then((w) => {
          w.board.tools.setActive(tool);
        });

        cy.get('#app')
          .trigger('mousedown', { x: 0, y: 0 })
          .trigger('mousemove', { clientX: 1, clientY: 1 })
          .trigger('mouseup', { clientX: 500, clientY: 500 });

        cy.window().then((w) => {
          w.board.tools.setActive('MoveTool');
        });

        // waiting for requestAnimationFrame
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.get('#app')
          .trigger('mousemove', { clientX: 100, clientY: 100 })
          .trigger('mousedown', { clientX: 105, clientY: 95 })
          .trigger('mouseup', { clientX: 105, clientY: 95 })
          .trigger('mousemove', { client: 100, clientY: 1 })
          .wait(20)
          .window()
          .then((w) => {
            expect(w.board.layers.getScratches('preview').length).to.be.equal(
              0
            );
          })
          .trigger('mousemove', { clientX: 105, clientY: 95 })
          .wait(20)
          .window()
          .then((w) => {
            expect(w.board.layers.getScratches('preview').length).to.be.equal(
              1
            );
          });
      });
    }
  });

  describe('DeleteTool', () => {
    for (const tool of ['PenTool', 'LineTool']) {
      it(`hovers on ${tool}'s scratch`, () => {
        cy.window().then((w) => {
          w.board.tools.setActive(tool);
        });

        cy.get('#app')
          .trigger('mousedown', { x: 0, y: 0 })
          .trigger('mousemove', { clientX: 1, clientY: 1 })
          .trigger('mouseup', { clientX: 500, clientY: 500 });

        cy.window().then((w) => {
          w.board.tools.setActive('DeleteTool');
        });

        // waiting for requestAnimationFrame
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.get('#app')
          .trigger('mousemove', { clientX: 100, clientY: 100 })
          .wait(20)
          .window()
          .then((w) => {
            expect(w.board.layers.getScratches('preview').length).to.be.equal(
              1
            );
          });
      });

      it(`remove ${tool}'s scratch`, () => {
        cy.window().then((w) => {
          w.board.tools.setActive(tool);
        });

        cy.get('#app')
          .trigger('mousedown', { x: 0, y: 0 })
          .trigger('mousemove', { clientX: 1, clientY: 1 })
          .trigger('mouseup', { clientX: 500, clientY: 500 })
          .window()
          .then((w) => {
            w.board.tools.setActive('DeleteTool');
          });

        // waiting for requestAnimationFrame
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.get('#app')
          .trigger('mousemove', { clientX: 100, clientY: 100 })
          .trigger('click', { clientX: 100, clientY: 100 })
          .wait(20)
          .window()
          .then((w) => {
            expect(w.board.layers.getScratches('main').length).to.be.equal(0);
          });
      });
    }
  });
});

describe('Layers', () => {
  it('Creates layers and makes it active', () => {
    cy.window().then((w) => {
      w.board.actions.dispatch(createLayer('new', 5, {}));
      w.board.tools.setActive('PenTool');
    });

    // waiting for requestAnimationFrame
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(20)
      .window()
      .then((w) => {
        w.board.layers.setActive('new');
      })
      .get('#app')
      .trigger('mousedown', { x: 0, y: 0 })
      .trigger('mousemove', { clientX: 1, clientY: 1 })
      .trigger('mouseup', { clientX: 500, clientY: 500 })
      .wait(20)
      .window()
      .then((w) => {
        expect(w.board.layers.getMaxZIndex()).to.be.equal(5);
        expect(w.board.layers.getScratches('new').length).to.be.equal(1);
        expect(
          Object.keys(w.board.layers.serialize().layers).length
        ).to.be.equal(3);
      });
  });

  it('Creates layer which has same width and height as window', () => {
    cy.window().then((w) => {
      w.board.actions.dispatch(createLayer('new', 5, {}));
      w.board.tools.setActive('PenTool');
    });

    // waiting for requestAnimationFrame
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(20)
      .get('body')
      .then(($body) => {
        const canvas = $body.find('#app canvas:nth-child(3)');
        expect($body.height()).to.be.equal(canvas.height());
        expect($body.width()).to.be.equal(canvas.width());
      });
  });

  // remove layer and check canvas count
  it('Removes layer with scratches', () => {
    cy.window().then((w) => {
      w.board.actions.dispatch(createLayer('new', 5, {}));
      w.board.tools.setActive('PenTool');
    });

    // waiting for requestAnimationFrame
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(20)
      .window()
      .then((w) => {
        w.board.layers.setActive('new');
      })
      .get('#app')
      .trigger('mousedown', { x: 0, y: 0 })
      .trigger('mousemove', { clientX: 1, clientY: 1 })
      .trigger('mouseup', { clientX: 500, clientY: 500 })
      .wait(20)
      .window()
      .then((w) => {
        expect(w.board.layers.getScratches('new').length).to.be.equal(1);
      });

    // waiting for requestAnimationFrame
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.window()
      .then((w) => {
        w.board.actions.dispatch(removeLayer('new', {}));
      })
      .wait(20)
      .window()
      .then((w) => {
        expect(w.board.layers.get('new')).to.be.undefined;

        const scratches = w.board.scratches.serialize();
        expect(scratches.length).to.be.equal(0);
        expect(w.board.layers.getScratches('new').length).to.be.equal(0);
      });
  });
});

