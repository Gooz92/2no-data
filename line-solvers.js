const solveUtils = require('./solve.utils.js');

module.exports = {
  solveBounds(line, bounds, clue) {
    const blockBounds = solveUtils.simpleBlock(clue, bounds);

    if (blockBounds.length > 0) {
     return blockBounds;
    }

    return null;
  },

  wrapSolvedBlock(line, [ start, end ]) {
    const empty = [];

    if (start > 0 && line.cells[start - 1].value !== 2) {
      empty.push(start - 1);
    }

    if (end < line.cells.length - 1 && line.cells[end + 1].value !== 2) {
      empty.push(end + 1);
    }

    return empty;
  }
};
