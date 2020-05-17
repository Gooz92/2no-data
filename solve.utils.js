const utils = require('./utils.js');

const FILLED = 1;

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

  narrowBounds1(bounds, cells, clueIndex, distribution) {
    const [ start, end ] = bounds;

    let i = start;

    while (cells[i] === 2 || (distribution[i].length === 1 && distribution[i][0][1] !== clueIndex)) {
      i++;
    }

    const newStart = i;

    i = end;

    while (cells[i] === 2 || (distribution[i].length === 1 && distribution[i][0][1] !== clueIndex)) {
      i--;
    }

    const newEnd = i;
    
    return [ newStart, newEnd ];
  },

  narrowBounds2(filledBlock, bounds, cells) {
    const [ blockStart, blockEnd ] = filledBlock;
    const [ start, end ] = bounds;

    let [ newStart, newEnd ] = bounds;

    for (let i = start; i <= blockStart - 1; i++) {
      if (cells[i] === 2) {
        newStart = i + 1;
      }
    }
    
    for (let i = end; i >= blockEnd + 1; i--) {
      if (cells[i] === 2) {
        newEnd = i - 1;
      }
    }

    return [ newStart, newEnd ];
  },

  narrowBounds(bounds, cells, index, distribution) {
    const [ s1, e1 ] = solveUtils.narrowBounds1(bounds, cells, index, distribution);

    const blocks = solveUtils.getFilledBlocks(bounds, cells);

    if (blocks.length !== 1) {
      return [ s1, e1 ];
    };

    const blockClue = solveUtils.detectBlockClue(blocks[0], distribution);

    if (blockClue && blockClue[1] === index) {
      const [ s2, e2 ] = solveUtils.narrowBounds2(blocks[0], bounds, cells);

      return [
        Math.max(s1, s2),
        Math.min(e1, e2)
      ];
    }

    return [ s1, e1 ];
  },

  buildOppositeSideBlocks(sideBlocks, opSideLength) {

    const opSideBlocks = utils.generateArray(opSideLength, () => []);

    for (let i = 0; i < sideBlocks.length; i++) {
      const lineBlocks = sideBlocks[i];
      for (let j = 0; j < lineBlocks.length; j++) {
        const block = lineBlocks[j];
        for (let k = block[0]; k <= block[1]; k++) {
          const opLineBlocks = opSideBlocks[k];
          if (opLineBlocks.length === 0) {
            opLineBlocks.push([ i, i ]);
          } else {
            const lastOpLineBlock = opLineBlocks[opLineBlocks.length - 1];
            if (i - lastOpLineBlock[1] === 1) {
              lastOpLineBlock[1] = i;
            } else {
              opLineBlocks.push([ i, i ]);
            }
          }
        }
      }
    }

    return opSideBlocks;
  },

  simpleBlock(clue, [ left, right ] ) {
    const start = right - clue + 1, end = left + clue - 1;
    
    if (start <= end) {
      return [ start, end ];
    }

    return [];
  },

  glue(clue, block, bounds) {

    const filled = [];

    const [ start, end ] = bounds;
    const [ startBlock, endBlock ] = block;
    const delta = clue - endBlock + startBlock - 1;

    const leftPadding = startBlock - start;
    const addToRight = delta - leftPadding;

    for (let i = endBlock + 1; i <= endBlock + addToRight && i < end; i++) {
      filled.push(i);
    }

    const rightPadding = end - endBlock;
    const addToLeft = delta - rightPadding;

    const s = startBlock - addToLeft;

    if (s < 0) return filled;

    for (let i = s; i < startBlock; i++) {
      filled.push(i);
    }

    return filled;
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

  getEmptyBlocks([ left, right ], cells) {
    const ranges = [];
    let inBlock = false;
    let start = 0;

    for (let i = left; i <= right; i++) {

      if (cells[i] === 0 && (i === 0 || cells[i - 1] === 2)) {
        if (inBlock) end = i;
        else start = i;
        inBlock = true;
      } else if (inBlock && cells[i] !== 0) {
        inBlock = false;
        if (cells[i] === 2) ranges.push([ start, i - 1]);
      }
    }

    return ranges;
  },

  getRanges([ left, right ], cells, status) { 
    const ranges = [];
    let inBlock = false;
    let start = 0;

    for (let i = left; i <= right; i++) {

      if (cells[i] === status) {
        if (inBlock) end = i;
        else start = i;
        inBlock = true;
      } else if (inBlock) {
        inBlock = false;
        ranges.push([ start, i - 1]);
      }
    }

    if (inBlock) {
      ranges.push([ start, right ]);
    }

    return ranges;
  },

  getFilledBlocks([ left, right ], cells) {
    return solveUtils.getRanges([ left, right ], cells, FILLED)
  },

  detectBlockClue(block, distribution) {
    const [ startBlock, endBlock ] = block;

    const blockLength = endBlock - startBlock + 1;

    for (let i = startBlock; i <= endBlock; i++) {
      const cellClues = distribution[i];
      const blockClue = cellClues[0];

      // at least one cell might be assigned to one clue
      if (cellClues.length === 1) {
        return blockClue;
      }

      const potentialClues = cellClues.filter(([ clueValue ]) => (
       clueValue >= blockLength
      ));

      if (potentialClues.length === 1) {
        return potentialClues[0];
      } else if (potentialClues.length > 1) {
        for (let i = 1; i < potentialClues.length; i++) {
          if (potentialClues[0][0] !== potentialClues[i][0]) {
            return null;
          }
        }
        
        // only if all potential clues has same value
        return [ potentialClues[0][0] ];
      }
    }

    return null;
  },

  // remove clues from distribution for cells outside bounds
  narrowCluesDistribution(clueIndex, line) {
    const bounds = line.bounds[clueIndex];
    const distribution = line.distribution;
    const [ start, end ] = bounds;

    let changed = false;

    for (let i = 0; i < start; i++) {
      const cellClues = distribution[i];
      const newCellClues = cellClues.filter(([ clueValue, cellClueIndex ]) => cellClueIndex !== clueIndex);

      if (newCellClues.length < cellClues.length) {
        changed = true;
        distribution[i] = newCellClues;
      }
    }

    for (let i = end + 1; i < distribution.length; i++) {
      const cellClues = distribution[i];
      const newCellClues = cellClues.filter(([ clueValue, cellClueIndex ]) => cellClueIndex !== clueIndex);

      if (newCellClues.length < cellClues.length) {
        changed = true;
        distribution[i] = newCellClues;
      }
    }

    return changed;
  },

  findEmptyCells(filledBlock, distribution) {
    const blockClue = solveUtils.detectBlockClue(filledBlock, distribution);

    const emptyCells = [];

    if (blockClue === null) {
      return emptyCells;
    }

    const [ startBlock, endBlock ] = filledBlock;

    // if block length == clue
    // mark cells in whick can be placed this block as empty
    if (endBlock - startBlock + 1 === blockClue[0]) {
      if (blockClue.length === 2) {
        const blockClueIndex = blockClue[1];
        distribution.forEach((cellClues, cellIndex) => {
          if (cellClues.length === 1 && cellClues[0][1] === blockClueIndex && (cellIndex < startBlock || cellIndex > endBlock)) {
            emptyCells.push(cellIndex);
          } else if (cellClues.length === 0) {
            emptyCells.push(cellIndex);
          }
        });
      }
  
      const leftEmpty = startBlock - 1;
      if (startBlock > 0 && !emptyCells.includes(leftEmpty)) {
        emptyCells.unshift(leftEmpty);
      }

      const rightEmpty = endBlock + 1;
      if (rightEmpty < distribution.length && !emptyCells.includes(rightEmpty)) {
        emptyCells.push(rightEmpty);
      }

      return emptyCells;
    }

    // block cannot contain unreachable cells ( < start - delta || > end + delta)
    if (blockClue.length === 2) {
      const [ clueValue, clueIndex ] = blockClue;
      const blockLength = endBlock - startBlock + 1;
      const delta = clueValue - blockLength;

      for (let i = 0; i < startBlock - delta; i++) {
        const cellClues = distribution[i];
        if (cellClues.length === 1 && cellClues[0][1] === clueIndex) {
          emptyCells.push(i);
        } else if (cellClues.length === 0) {
          emptyCells.push(i);
        }
      }

      for (let i = endBlock + delta + 1; i < distribution.length; i++) {
        const cellClues = distribution[i];
        if (cellClues.length === 1 && cellClues[0][1] === clueIndex) {
          emptyCells.push(i);
        } else if (cellClues.length === 0) {
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

  getAbsoluteIndex(lineIndex, side, cellIndex) {
    return converters[side](lineIndex, cellIndex);
  },

  getAbsoluteIndexes(lineIndex, side, indexes) {
    return indexes.map(index => solveUtils.getAbsoluteIndex(lineIndex, side, index));
  },

  fillBlocks(blocks, cells) {
    blocks.forEach(block => {
      const [ start, end ] = block;

      for (let i = start; i <= end; i++) {
        cells[i] = 1;
      }
    });
  },

  toFlatArray(rows) {
    const field = [];

    rows.forEach(row => {
      row.forEach(cell => {
        field.push(cell);
      });
    });

    return field;
  }
};

module.exports = solveUtils;
