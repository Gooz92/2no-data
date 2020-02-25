const FILLED = 1;

const identity = value => value;

function generateArray(length, generateItem = identity) {
  const array = [];

  for (let i = 0; i < length; i++) {
    array.push(generateItem(i));
  }

  return array;
}

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
  },

  getFilledBlocks([ left, right ], line) {
    const blocks = [];
    let inBlock = false;
    let start = 0, end = 0;

    for (let i = left; i <= right; i++) {

      if (line[i] === FILLED) {
        if (inBlock) end = i;
        else start = i;
        inBlock = true;
      } else if (inBlock) {
        inBlock = false;
        blocks.push([ start, i - 1]);
      }
    }

    if (inBlock) {
      blocks.push([ start, right ]);
    }

    return blocks;
  },

  findEmptyCells(clue, filledBlock, [ left, rigth ]) {
    const blockLength = filledBlock[1] - filledBlock[0] + 1;
    const delta = clue - blockLength;

    const emptyCells = [];
  
    for (let i = left; i < filledBlock[0] - delta; i++) {
      emptyCells.push(i);
    }

    for (let i = filledBlock[1] + 1 + delta; i <= rigth; i++) {
      emptyCells.push(i);
    }

    return emptyCells;
  },

  build(rowSideClues, colSideClues) {
    const rows = rowSideClues.map((rowClues, index) => {
      const bounds = solveUtils.calculateBounds(rowClues, colSideClues.length);
      return {
        clues: rowClues,
        cells: generateArray(colSideClues.length, () => ({})),
        side: 0,
        bounds,
        index
      };
    });

    const cols = colSideClues.map((colClues, index) => {
      
    });

    return [ ...rows, ...cols ];
  }

};

module.exports = solveUtils;