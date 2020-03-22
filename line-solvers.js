const solveUtils = require('./solve.utils.js');

module.exports = {
  solveBounds(line) {
    const filled = [];

    line.clues.forEach((clue, index) => {
      const bounds = line.bounds[index];
      const [ start, end ] = solveUtils.simpleBlock(clue, bounds);

      for (let i = start; i <= end; i++) {
        if (line.cells[i].value === 0) {
          filled.push(i);
        }
      }
    });

    return { filled };
  },

  wrapSolvedBlocks(line) {
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
        if (line.cells[i].value === 0) {
          empty.push(i);
        }
      });
    });
  
    return { empty };
  },

  glue(line) {
    const filled = [];
    const cells =  line.cells.map(c => c.value);

    line.clues.forEach((clue, index) => {
      const bounds = line.bounds[index];
      const blocks = solveUtils.getFilledBlocks(bounds, cells);

      if (blocks.length === 1) {
        const block = blocks[0];
        const blockClue = solveUtils.detectBlockClue(block, line.cluesDistribution);

        if (!blockClue) return;

        const indexes = solveUtils.glue(clue, block, bounds);
        indexes.forEach(i => {
          if (line.cells[i].value === 0) {
            filled.push(i);
          }
        });
      }
    });

    return { filled };
  }
};