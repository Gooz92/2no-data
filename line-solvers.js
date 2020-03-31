const solveUtils = require('./solve.utils.js');

function blockGlue(block, bounds, line, index) {

  const filled = [];

  const blockClue = solveUtils.detectBlockClue(block, line.cluesDistribution);

  if (!blockClue || blockClue[1] !== index) return [];

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

    const cells = line.cells.map(c => c.value);

    line.clues.forEach((clue, index) => {
      const bounds = line.bounds[index];
      const [ start, end ] = solveUtils.simpleBlock(clue, bounds);

      if (end - start + 1 === clue) {
        for (let i = bounds[0]; i <= bounds[1]; i++) {
          if (cells[i] === 2) line.cluesDistribution[i] = [];
          if (cells[i] === 1) line.cluesDistribution[i] = [ [ clue, index ] ];
        }
      }

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

      filled.push(...blockGlue(firstBlock, bounds, line, index));

      if (blocks.length > 1) {
        const lastBlock = blocks[blocks.length - 1];
        filled.push(...blockGlue(lastBlock, bounds, line, index));
      }

    });

    return { filled };
  },

  markEmpty(line) {

    const cells = line.cells.map(c => c.value);

    const empty = [];

    line.clues.forEach((clue, index) => {
      const bounds = line.bounds[index];

      const emptyBlocks = solveUtils.getEmptyBlocks(bounds, cells);
      emptyBlocks.forEach(block => {
        const bclue = solveUtils.detectBlockClue(block, line.cluesDistribution);

        if (bclue && bclue[0] === clue && clue > block[1] - block[0] + 1) {
          for (let i = block[0]; i <= block[1]; i++) {
            if (cells[i] === 0) empty.push(i);
          }
        }
      });
    });

    return { empty };
  }

};