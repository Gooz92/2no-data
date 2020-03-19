const solveUtils = require('./solve.utils.js'),
  buildNono = require('./build-nono.js');

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

function narrowBounds(line) {

  line.clues.forEach((clue, index) => {
    const bounds = line.bounds[index];

    const blocks = solveUtils.getFilledBlocks(bounds, line.cells.map(c => c.value));

    if (blocks.length !== 1) {
      return;
    }
    
    const blockClue = solveUtils.detectBlockClue(blocks[0], line.cluesDistribution);

    if (blockClue.length === 2) {
      line.bounds[index] = solveUtils.narrowBounds(blocks[0], bounds, line.cells.map(c => c.value));
    }
  });
}

function wrapSolvedBlocks(line) {
  const empty = [];

  line.clues.forEach((clue, index) => {
    const bounds = line.bounds[index];

    const blocks = solveUtils.getFilledBlocks(bounds, line.cells.map(c => c.value));

    if (blocks.length !== 1) {
      return;
    }

    const block = blocks[0];

    const indexes = solveUtils.findEmptyCells(block, line.cluesDistribution);

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

      narrowBounds(line);
    });
  } while (changed);
}

module.exports = (hClues, vClues) => {
  const nono = buildNono(hClues, vClues);
  solve(nono);
  const flatField = solveUtils.toFlatArray(nono.rows);
  return flatField;
};
