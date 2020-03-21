const solveUtils = require('./solve.utils.js');

function solveBounds(line) {
  const filled = [];

  line.clues.forEach((clue, index) => {
    const bounds = line.bounds[index];
    const [ start, end ] = solveUtils.simpleBlock(clue, bounds);

    for (let i = start; i <= end; i++) {
      if (line.cells[i].value !== 1) {
        filled.push(i);
      }
    }
  });

  return solveUtils.getAbsoluteIndexes(line.index, line.side, filled);
}

function glue(line) {
  const filled = [];

  line.clues.forEach((clue, index) => {
    const bounds = line.bounds[index];

    const blocks = solveUtils.getFilledBlocks(bounds, line.cells.map(c => c.value));

    if (blocks.length !== 1) {
      return;
    }

    const blockClue = solveUtils.detectBlockClue(blocks[0], line.cluesDistribution);

    if (blockClue && blockClue.length === 2) {
      const indexes = solveUtils.glue(clue, blocks[0], bounds);

      indexes.forEach(i => {
        if (line.cells[i].value !== 2) {
          filled.push(i);
        }
      });
    }
  });

  return solveUtils.getAbsoluteIndexes(line.index, line.side, filled);
}

function narrowBounds(line) {

  let changed = false;

  line.clues.forEach((clue, index) => {
    const bounds = line.bounds[index];

    const blocks = solveUtils.getFilledBlocks(bounds, line.cells.map(c => c.value));

    if (blocks.length !== 1) {
      return;
    }
    
    const blockClue = solveUtils.detectBlockClue(blocks[0], line.cluesDistribution);

    if (blockClue && blockClue.length === 2) {
      const newBounds = solveUtils.narrowBounds(blocks[0], bounds, line.cells.map(c => c.value));

      if (newBounds[0] !== bounds[0] || newBounds[1] !== bounds[1]) {
        changed = true;
        line.bounds[index] = solveUtils.narrowBounds(blocks[0], bounds, line.cells.map(c => c.value));
      }
    }
  });

  return changed;
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

function step(nonogram) {
  let changed = false;

  nonogram.lines.forEach(line => {
    const filled = solveBounds(line); 

    if (filled.length > 0) {
      changed = true;
      filled.forEach(([ i, j ]) => {
        nonogram.rows[i].cells[j].value = 1;
      });
    }

    // const filled1 = glue(line); 

    // if (filled1.length > 0) {
    //   changed = true;
    //   filled1.forEach(([ i, j ]) => {
    //     nonogram.rows[i].cells[j].value = 1;
    //   });
    // }

    const empty = wrapSolvedBlocks(line);
    if (empty.length > 0) {
      changed = true;
      empty.forEach(([ i, j ]) => {
        nonogram.rows[i].cells[j].value = 2;
      });
    }

    if (narrowBounds(line)) {
      changed = true;
    }
  });

  return changed;
}

module.exports = function createSolver(nono) {

  return {
    step() {
      this.changed = step(nono);
    }
  };
};
