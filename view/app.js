import buildNonogramComponent from './nonogram.js';

const buildNono = require('../build-nono.js');
const createSolver = require('../create-solver.js');

const [ hClues, vClues ] = require('../data/bw/8x8/elephant.json');

const nonogramComponent = buildNonogramComponent(hClues, vClues, 42);

const nono = buildNono(hClues, vClues)
const solver = createSolver(nono);

function step() {
  setTimeout(() => {
    const line = solver.solveNextLine();
    if (line) {
      nonogramComponent.highlightLine(line.index, line.side);
      nonogramComponent.drawLine(line);
      step();
    }
  }, 500);
}

document.addEventListener('DOMContentLoaded', () => {
  document.body.appendChild(nonogramComponent.element);
  step();

  nonogramComponent.hightlightRow(3);
});



