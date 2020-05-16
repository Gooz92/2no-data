const lineSolvers = require('./line-solvers.js');
const solveUtils = require('./solve.utils.js');

function solveLine(line) {

  let changed = false;

  line.bounds.forEach((bounds, index) => {
    const { block } = lineSolvers.solveBounds(line, bounds, index);
    if (block.length > 0 && line.blocks[index].length === 0) {
      line.blocks[index] = block;
      changed = true;
    }
  });

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
