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

function wrapSolvedBlocks(line) {
  const empty = [];

  const cluesDistribution = solveUtils.buildCluesDistribution(line.clues, line.bounds);

  line.clues.forEach((clue, index) => {
    const bounds = line.bounds[index];

    const blocks = solveUtils.getFilledBlocks(bounds, line.cells.map(c => c.value));

    if (blocks.length !== 1) {
      return;
    }

    const block = blocks[0];

    const indexes = solveUtils.findEmptyCells(block, cluesDistribution);

    indexes.forEach(i => {
      if (line.cells[i].value !== 2) {
        empty.push(i);
      }
    });
  });

  return solveUtils.getAbsoluteIndexes(line.index, line.side, empty);
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

      const empty = wrapSolvedBlocks(line);
      if (empty.length > 0) {
        changed = true;
        empty.forEach(([ i, j ]) => {
          nonogram.rows[i].cells[j].value = 2;
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
