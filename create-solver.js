const solveUtils = require('./solve.utils.js'),
  lineSolvers = require('./line-solvers.js');

function narrowBounds(line) {
  
  let changed = false;

  const cells = line.cells.map(c => c.value);

  line.clues.forEach((clue, index) => {
    const bounds = line.bounds[index];
    const newBounds = solveUtils.narrowBounds(bounds, cells, index, line.cluesDistribution);

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
    if (solveUtils.narrowCluesDistribution(index, line)) {
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

  if (narrowCluesDistribution(line)) {
    changed = true;
  }

  return changed;
}

module.exports = function createSolver(nonogram) {

  return {
    nonogram,

    lineIndex: 0,

    changed: false,

    nextLine() {

      if (this.lineIndex === this.nonogram.lines.length) {
        if (!this.changed) {
          return null;
        }

        this.changed = false;
        this.lineIndex = 0;
      }

      return this.nonogram.lines[this.lineIndex++];
    },

    solveNextLine() {
      const line = this.nextLine();

      if (line === null) {
        return null;
      }

      if (solveLine(line)) {
        this.changed = true;
      }

      return line;
    }
  };
};
