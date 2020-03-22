const solveUtils = require('./solve.utils.js'),
  lineSolvers = require('./line-solvers.js');

function narrowBounds(line) {
  let changed = false;

  const cells = line.cells.map(c => c.value);

  line.clues.forEach((clue, index) => {
    const bounds = line.bounds[index];

    const blocks = solveUtils.getFilledBlocks(bounds, cells);

    if (blocks.length !== 1) {
      return;
    }
    
    const blockClue = solveUtils.detectBlockClue(blocks[0], line.cluesDistribution);

    if (blockClue) {
      const newBounds = solveUtils.narrowBounds(blocks[0], bounds, cells);

      if (newBounds[0] > bounds[0]) {
        changed = true;
        line.bounds[index][0] = newBounds[0];
      }

      if (newBounds[1] < bounds[1]) {
        changed = true;
        line.bounds[index][1] = newBounds[1];
      }
    }
  });

  return changed;
}

function narrowBounds1(line) {
  
  let changed = false;

  const cells = line.cells.map(c => c.value);

  line.clues.forEach((clue, index) => {
    const bounds = line.bounds[index];
    const newBounds = solveUtils.narrowBounds1(bounds, cells);

    if (newBounds[0] > bounds[0]) {
      changed = true;
      line.bounds[index][0] = newBounds[0];
    }

    if (newBounds[1] < bounds[1]) {
      changed = true;
      line.bounds[index][1] = newBounds[1];
    }
  });

  return changed; 
}

function narrowCluesDistribution(line) {

  let changed = false;

  line.clues.forEach((clue, index) => {
    const bounds = line.bounds[index];
    if (solveUtils.narrowCluesDistribution(index, bounds, line.cluesDistribution)) {
      changed = true;
    }
  });

  return changed;
}

function solveLine(line) {

  let changed = false;

  Object.values(lineSolvers).forEach(solver => {
    const { filled = [], empty = [] } = solver(line);


    if (filled.length > 0) {
      changed = true;
      filled.forEach(i => {
        line.cells[i].value = 1;
      });
    }

    if (empty.length > 0) {
      changed = true;
      empty.forEach(i => {
        line.cells[i].value = 2;
      });
    }
  });

  if (narrowBounds(line)) {
    changed = true;
  }

  if(narrowBounds1(line)) {
    changed = true;
  }

  if (narrowCluesDistribution(line)) {
    changed = true;
  }

  return changed;
}

function step(nonogram, lineIndex) {
  let changed = false;

  nonogram.lines.forEach(line => {
    if (solveLine(line)) {
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
