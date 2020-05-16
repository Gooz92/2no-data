const lineSolvers = require('./line-solvers.js');
const solveUtils = require('./solve.utils.js');

function solveBounds(line) {
  const filled = [];
  const blocks = [];

  line.clues.forEach((clue, index) => {
    const bounds = line.bounds[index];
    const [ start, end ] = solveUtils.simpleBlock(clue, bounds);
    const blockLength = end - start + 1;

    
    if (blockLength === clue) {
      for (let i = bounds[0]; i <= bounds[1]; i++) {
        if (line.cells[i].value === 2) line.distribution[i] = [];
        if (line.cells[i].value === 1) line.distribution[i] = [ [ clue, index ] ];
      }
    }

    if (blockLength > 0) {
      blocks.push([ start, end ]);
      for (let i = start; i <= end; i++) {
        if (line.cells[i].value === 0) {
          filled.push(i);
        }
      }
    }
  });

  return { blocks, filled };
};

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

  return changed;
}

module.exports = function createSolver(nonogram) {

  return {
    nonogram,

    lineIndex: 0,

    changed: false,

    step: 0,

    nextLine() {

      if (this.lineIndex === this.nonogram.lines.length) {
        this.step++;
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

      if (this.step === 0) {
        const { filled = [], blocks = [] } = solveBounds(line);

        if (filled.length > 0) {
          this.changed = true;
          line.blocks = blocks;
          filled.forEach(i => {
            line.cells[i].value = 1;
          });
        }
      } else if (solveLine(line)) {
        this.changed = true;
      }

      return line;
    }
  };
};
