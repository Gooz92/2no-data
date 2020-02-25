const FILLED = 1;

const solveUtils = {
  calculateBounds(clues, length) {
    const lefts = [ 0 ];
    const rigths = [ length - 1 ];
  
    let left = 0, right = length - 1;
  
    for (let i = 0; i < clues.length - 1; i++) {
      lefts.push(left += clues[i] + 1);
      rigths.unshift(right -= clues[clues.length - i - 1] + 1);
    }

    const bounds = [];
  
    for (let i = 0; i < clues.length; i++) {
      bounds.push([ lefts[i], rigths[i] ]);
    }
  
    return bounds;
  },

  simpleBlock(clue, [ left, right ] ) {
    const filledCellIndexes = [];
  
    for (let i = right - clue + 1; i < left + clue; i++) {
      filledCellIndexes.push(i);
    }

    return filledCellIndexes;
  },

  cluesIndexesMask(bounds) {
    const length = bounds[bounds.length - 1][1] + 1;
    const line = [];

    for (let i = 0; i < length; i++) {
      const cellClues = [];
      for (let j = 0; j < bounds.length; j++) {
        const [ left, right ] = bounds[j];
        if (i >= left && i <= right) {
          cellClues.push(j);
        }
      }
      line.push(cellClues);
    }

    return line;
  }

};

module.exports = solveUtils;
