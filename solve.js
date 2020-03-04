
const solveUtils = require('./solve.utils.js');

function solveBounds(line) {
  const filled = [];

  line.clues.forEach((clue, index) => {
    const bounds = line.bounds[index];
    const indexes = solveUtils.simpleBlock(clue, bounds);
    indexes.forEach(i => {
      if (line.cells[i].value !== 1) {
        filled.push(i);
      }
    });
  });

  return solveUtils.getAbsoluteIndexes(line.index, line.side, filled);
}

function solve(nonogram) {

  let changed;

  do {
    changed = false;

    nonogram.lines.forEach(line => {
      const filled = solveBounds(line); 

      if (filled.length > 0) {
        changed = true;
        filled.forEach(([ i, j ]) => {
          nonogram.rows[i].cells[j].value = 1;
        });
      }
    });
  } while (changed);
}

module.exports = (hClues, vClues) => {
  const nono = solveUtils.build(hClues, vClues);
  solve(nono);
  const flatField = solveUtils.toFlatArray(nono.rows);
  return flatField;
};
