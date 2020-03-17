const FILLED = 1;

const identity = value => value;

function generateArray(length, generateItem = identity) {
  const array = [];

  for (let i = 0; i < length; i++) {
    array.push(generateItem(i));
  }

  return array;
}

const converters = [
  (lineIndex, index) => [ lineIndex, index ],
  (lineIndex, index) => [ index, lineIndex ]
];

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

  buildCluesDistribution(clues, bounds) {
    const length = bounds[bounds.length - 1][1] + 1;
    const distribution = [];

    for (let i = 0; i < length; i++) {
      const cellClues = [];
      for (let j = 0; j < bounds.length; j++) {
        const [ left, right ] = bounds[j];
        if (i >= left && i <= right) {
          cellClues.push([ clues[j], j ]);
        }
      }
      distribution.push(cellClues);
    }

    return distribution;
  },

  getFilledBlocks([ left, right ], line) {
    const blocks = [];
    let inBlock = false;
    let start = 0;

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

  detectBlockClue(filledBlock, cluesDistribution) {
    const [ startBlock, endBlock ] = filledBlock;

    let blockClueValue = null;

    for (let i = startBlock; i <= endBlock; i++) {
      const cellClues = cluesDistribution[i];
      const blockClue = cellClues[0];
      blockClueValue = blockClue[0];

      if (cellClues.length === 1) {
        return blockClue;
      }

      for (let j = 1; j < cellClues.length; j++) {
        if (blockClueValue !== cellClues[j][0]) {
          break;
        }
      }
    }

    return blockClueValue === null ? null : [ blockClueValue ];
  },

  findEmptyCells(filledBlock, cluesDistribution) {
    const blockClue = solveUtils.detectBlockClue(filledBlock, cluesDistribution);

    const emptyCells = [];

    if (blockClue === null) {
      return emptyCells;
    }

    const [ startBlock, endBlock ] = filledBlock;

    if (endBlock - startBlock + 1 === blockClue[0]) {
      if (blockClue.length === 2) {
        const blockClueIndex = blockClue[1];
        cluesDistribution.forEach((cellClues, cellIndex) => {
          if (cellClues.length === 1 && cellClues[0][1] === blockClueIndex && (cellIndex < startBlock || cellIndex > endBlock)) {
            emptyCells.push(cellIndex);
          }
        });
      }
  
      const leftEmpty = startBlock - 1;
      if (startBlock > 0 && !emptyCells.includes(leftEmpty)) {
        emptyCells.unshift(leftEmpty);
      }

      const rightEmpty = endBlock + 1;
      if (rightEmpty < cluesDistribution.length && !emptyCells.includes(rightEmpty)) {
        emptyCells.push(rightEmpty);
      }

      return emptyCells;
    }

    if (blockClue.length === 2) {
      const [ clueValue, clueIndex ] = blockClue;
      const blockLength = endBlock - startBlock + 1;
      const delta = clueValue - blockLength;

      for (let i = 0; i < startBlock - delta; i++) {
        const cellClues = cluesDistribution[i];
        if (cellClues.length === 1 && cellClues[0][1] === clueIndex) {
          emptyCells.push(i);
        }
      }

      for (let i = endBlock + delta + 1; i < cluesDistribution.length; i++) {
        const cellClues = cluesDistribution[i];
        if (cellClues.length === 1 && cellClues[0][1] === clueIndex) {
          emptyCells.push(i);
        }
      }
    }

    return emptyCells;
  },

  generateLineClues(length) {
    const allClues = [ [ length ] ];
  
    let i = 0, last;

    do {
      const clues = allClues[i];
      const head = clues.slice(0, clues.length - 1);

      last = clues[clues.length - 1];
      
      for (let j = 1; j < last - 1; j++) {
        allClues.push([ ...head, j, last - j - 1]);
      }
      
      ++i;
    } while (i < allClues.length);

    return allClues;
  },

  build(horizontalClues, verticalClues) {
    const rows = horizontalClues.map((clues, index) => {
      const bounds = solveUtils.calculateBounds(clues, verticalClues.length);
      return {
        cells: generateArray(verticalClues.length, () => ({ value: 0 })),
        clues,
        side: 0,
        bounds,
        index
      };
    });

    const cols = verticalClues.map((clues, index) => {
      const bounds = solveUtils.calculateBounds(clues, horizontalClues.length);
      return {
        cells: [],
        clues,
        side: 1,
        bounds,
        index
      }
    });

    for (let i = 0; i < horizontalClues.length; i++) {
      for (let j = 0; j < verticalClues.length; j++) {
        cols[j].cells[i] = rows[i].cells[j];
      }
    }

    return { rows, cols, lines: [ ...rows, ...cols ] };
  },

  getAbsoluteIndexes(lineIndex, side, indexes) {
    return indexes.map(index => converters[side](lineIndex, index));
  },

  toFlatArray(rows) {
    const field = [];

    rows.forEach(row => {
      row.cells.forEach(cell => {
        field.push(cell.value);
      });
    });

    return field;
  }
};

module.exports = solveUtils;
