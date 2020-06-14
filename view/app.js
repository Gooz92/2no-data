import buildNonogramComponent from './nonogram.js';

const { buildNono } = require('../build-nono.js');
const createSolver = require('../create-solver.js');
const solveUtils = require('../solve.utils.js');

const [ hClues, vClues ] = require('../data/bw/10x10/chicken.json');

const nonogramComponent = buildNonogramComponent(hClues, vClues, 36);

const nono = buildNono(hClues, vClues)
const solver = createSolver(nono);

window.__nono__ = nono;
window.__nono_cmp__ = nonogramComponent;

document.addEventListener('DOMContentLoaded', () => {
  document.body.appendChild(nonogramComponent.element);

  let line;

  do {
    line = solver.solveNextLine();
  } while (line);

  const rows = nono.rows.map(row => (
    row.cells.map(c => c.value)
  ));

  const field = solveUtils.toFlatArray(rows);

  nonogramComponent.drawField(field);

});
