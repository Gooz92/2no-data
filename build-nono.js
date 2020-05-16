const solveUtils = require('./solve.utils.js'),
  utils = require('./utils.js');

module.exports = function (horizontalClues, verticalClues) {
  const rows = horizontalClues.map((clues, index) => {
    const bounds = solveUtils.calculateBounds(clues, verticalClues.length),
      distribution = solveUtils.buildCluesDistribution(clues, bounds);

    return {
      cells: utils.generateArray(verticalClues.length, () => ({ value: 0 })),
      clues,
      side: 0,
      bounds,
      distribution,
      index
    };
  });

  const cols = verticalClues.map((clues, index) => {
    const bounds = solveUtils.calculateBounds(clues, horizontalClues.length),
      distribution = solveUtils.buildCluesDistribution(clues, bounds);

    return {
      cells: [],
      clues,
      side: 1,
      bounds,
      distribution,
      index
    }
  });

  for (let i = 0; i < horizontalClues.length; i++) {
    for (let j = 0; j < verticalClues.length; j++) {
      cols[j].cells[i] = rows[i].cells[j];
    }
  }

  return { rows, cols, lines: [ ...rows, ...cols ] };
}