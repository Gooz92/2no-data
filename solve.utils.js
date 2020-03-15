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

  findEmptyCells(clues, filledBlock, mask) {
    const [ startBlock, endBlock ] = filledBlock;

    let f = false, f1 = false, blockClue, blockClueIndex;

    for (let i = startBlock; i <= endBlock; i++) {
      const cellClueIndexes = mask[i];
      const cellClues = cellClueIndexes.map(index => clues[index]);
      if (cellClues.length === 1 || cellClues.every(clue => clue === cellClues[0])) {
        f = true;
        f1 = cellClues.length === 1;
        blockClue = cellClues[0];
        blockClueIndex = cellClueIndexes[0];
        break;
      }
    }

    const emptyCells = [];

    if (f && endBlock - startBlock + 1 === blockClue) {
      mask.forEach((clueIndexes, cellIndex) => {
        if (f1 && clueIndexes.length === 1 && clueIndexes[0] === blockClueIndex && (cellIndex < startBlock || cellIndex > endBlock)) {
          emptyCells.push(cellIndex);
        }
      });

      const leftEmpty = startBlock - 1;
      if (startBlock > 0 && !emptyCells.includes(leftEmpty)) {
        emptyCells.unshift(leftEmpty);
      }

      const rightEmpty = endBlock + 1;
      if (rightEmpty < mask.length && !emptyCells.includes(rightEmpty)) {
        emptyCells.push(rightEmpty);
      }

      return emptyCells;
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
