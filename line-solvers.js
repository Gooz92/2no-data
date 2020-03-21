const solveUtils = require('./solve.utils.js');

function calcIndexesForMerging(blocks) {

  const filled = [];

  for (let i = 0; i < blocks.length - 1; i++) {
    const start = blocks[i][1],
      end = blocks[i + 1][0];
    
    for (let j = start + 1; j < end; j++) {
      filled.push(j);
    }
  }

  return filled;
}

module.exports = {
  solveBounds(line) {
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
        if (line.cells[i].value !== 2) {
          empty.push(i);
        }
      });
    });
  
    return { empty };
  },

   mergeBlocks(line) {
    const filled = [];
  
    line.clues.forEach((clue, index) => {
      const bounds = line.bounds[index];
  
      const blocks = solveUtils.getFilledBlocks(bounds, line.cells.map(c => c.value));
      const blocksToMerge = blocks.map(block => ({
        clueIndex: (solveUtils.detectBlockClue(block, line.cluesDistribution) || [])[1],
        block
      })).filter(({ clueIndex }) => clueIndex);
  
      if (blocksToMerge.length > 1 && blocksToMerge.every(({ clueIndex }) => clueIndex === blocksToMerge[0].clueIndex)) {
        const indexes = calcIndexesForMerging(blocksToMerge.map(({ block }) => block));
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