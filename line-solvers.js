const solveUtils = require('./solve.utils.js');

function blockGlue(block, bounds, line) {

  const filled = [];

  const blockClue = solveUtils.detectBlockClue(block, line.cluesDistribution);

  if (!blockClue) return [];

  const indexes = solveUtils.glue(blockClue[0], block, bounds);

  indexes.forEach(i => {
    if (line.cells[i].value === 0) {
      filled.push(i);
    }
  });

  return filled;
}

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

      if (blocks.length === 0) return;

      const firstBlock = blocks[0];

      filled.push(...blockGlue(firstBlock, bounds, line));

      if (blocks.length > 1) {
        const lastBlock = blocks[blocks.length - 1];
        filled.push(...blockGlue(lastBlock, bounds, line));
      }

    });

    return { filled };
  }
};