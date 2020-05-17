const solveUtils = require('./solve.utils.js'),
  utils = require('./utils.js');

module.exports = function (horizontalClues, verticalClues) {
  const rows = horizontalClues.map((clues, index) => {
    const bounds = solveUtils.calculateBounds(clues, verticalClues.length),
      distribution = solveUtils.buildCluesDistribution(clues, bounds);
    
    const row = {
      clues,
      blocks: [],
      side: 0,
      bounds,
      distribution,
      index
    };

    row.cells = utils.generateArray(verticalClues.length, () => ({ value: 0, row }));

    return row;
  });

  const cols = verticalClues.map((clues, index) => {
    const bounds = solveUtils.calculateBounds(clues, horizontalClues.length),
      distribution = solveUtils.buildCluesDistribution(clues, bounds);

    return {
      cells: [],
      clues,
      blocks: [],
      side: 1,
      bounds,
      distribution,
      index
    }
  });

  for (let i = 0; i < horizontalClues.length; i++) {
    for (let j = 0; j < verticalClues.length; j++) {
      const cell = rows[i].cells[j];
      cell.col = cols[j];
      cols[j].cells[i] = cell;
    }
  }

  return { rows, cols, lines: [ ...rows, ...cols ] };
}