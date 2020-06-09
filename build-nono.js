const solveUtils = require('./solve.utils.js'),
  utils = require('./utils.js');

function buildLine(clues, length, index, side) {
  const bounds = solveUtils.calculateBounds(clues, length);
  const distribution = solveUtils.buildCluesDistribution(clues, bounds);

  return { clues, distribution, side, index };
}

function buildNono(horizontalClues, verticalClues) {
  const rows = horizontalClues.map((clues, index) => {
    const row = buildLine(clues, verticalClues.length, index, 0);
    row.cells = utils.generateArray(verticalClues.length, () => ({ value: 0, lines: [ row ] }));
    return row;
  });

  const cols = verticalClues.map((clues, index) => {
    const col = buildLine(clues, horizontalClues.length, index, 1);
    col.cells = [];
    return col;
  });

  for (let i = 0; i < horizontalClues.length; i++) {
    for (let j = 0; j < verticalClues.length; j++) {
      const cell = rows[i].cells[j];
      const col = cols[j];

      cell.lines.push(col);
      col.cells[i] = cell;
    }
  }

  return { rows, cols, lines: [ ...rows, ...cols ] };
}

module.exports = { buildLine, buildNono };
