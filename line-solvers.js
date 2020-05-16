const solveUtils = require('./solve.utils.js');

function blockGlue(block, bounds, line, index) {

  const filled = [];

  const blockClue = solveUtils.detectBlockClue(block, line.distribution);

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
  solveBounds(line, bounds, index) {
    const clue = line.clues[index];

    return { block: solveUtils.simpleBlock(clue, bounds) };
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
  
      const indexes = solveUtils.findEmptyCells(block, line.distribution);
  
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

      if (line.blocks.length === 0) return;

      const firstBlock = blocks[0];

      filled.push(...blockGlue(firstBlock, bounds, line, index));

      if (blocks.length > 1) {
        const lastBlock = blocks[blocks.length - 1];
        filled.push(...blockGlue(lastBlock, bounds, line, index));
      }

    });

    return { filled };
  },

  /*
   * if length of every block in the line equal to corresponding clue just mark 
   * unknown cell as empty
   */

  markSolvedBlocks(line) {
    const cells = line.cells.map(c => c.value);

    const empty = [];

    const blocks = solveUtils.getFilledBlocks([ 0, cells.length - 1 ], cells );


    if (blocks.length !== line.clues.length) {
      return { empty };
    }

    const solved = line.clues.every((clue, index) => {
      const block = blocks[index];
      const blockLength = block[1] - block[0] + 1;
      return clue === blockLength;
    });

    if (!solved) {
      return { empty };
    }

    for (let i = 0; i < cells.length; i++) {
      if (cells[i] === 0) empty.push(i);
    }

    return { empty }
  },

  markEmpty(line) {

    const cells = line.cells.map(c => c.value);

    const empty = [];

    line.clues.forEach((clue, index) => {
      const bounds = line.bounds[index];

      const emptyBlocks = solveUtils.getEmptyBlocks(bounds, cells);
      emptyBlocks.forEach(block => {
        const bclue = solveUtils.detectBlockClue(block, line.distribution);

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