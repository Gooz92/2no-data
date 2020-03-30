import buildNonogramComponent from './nonogram.js';

const buildNono = require('../build-nono.js');
const createSolver = require('../create-solver.js');

const [ hClues, vClues ] = require('../data/bw/house-7x7.json');

const nonogramComponent = buildNonogramComponent(hClues, vClues, 42);

const nono = buildNono(hClues, vClues)
const solver = createSolver(nono);

window.__nono__ = nono;

document.addEventListener('DOMContentLoaded', () => {
  document.body.appendChild(nonogramComponent.element);

  document.getElementById('step-btn')
    .addEventListener('click', e => {
      const line = solver.solveNextLine();
      if (line) {
        nonogramComponent.highlightLine(line.index, line.side);
        nonogramComponent.drawLine(line);
      }
    });
});
