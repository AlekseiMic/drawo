import { Manager } from '../../../drawer';
import { expect } from 'chai';

declare global {
  interface Window {
    board: Manager;
  }
}

describe('inits canvas', () => {
  it('page has canvas element', () => {
    cy.visit('http://localhost:4320');
    cy.get('#app')
      .trigger('mousedown', { x: 0, y: 0 })
      .trigger('mousemove', { clientX: 1, clientY: 1 })
      .trigger('mouseup', { clientX: 100, clientY: 600 });
    cy.window().then((w) => {
      expect(w.board.scratches.serialize().length).to.be.equal(1);
    });
  });
});
