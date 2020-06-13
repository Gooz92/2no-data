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

  isAnotherClueBounds(cellClues, clueIndex) {
    return cellClues.length === 0 || cellClues.every(clue => clue[1] !== clueIndex);
  },

  filterClueBounds(clueIndex, boundsIndex, clueBounds, distribution) {
    let changed = false;

    for (let i = 0; i < clueBounds.length; i++) {
      if (i !== boundsIndex) {
        const [ start, end ] = clueBounds[i];
        for (let j = start; j <= end; j++) {
          const cellClues = distribution[j].filter(clue => clue[1] != clueIndex);

          if (cellClues.length < distribution[j]) {
            distribution[j] = cellClues;
            changed = true;
          }
        }
      }
    }

    return changed;
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

  getBlocks(cells) {
    const blocks = [ [], [], [] ];

    let blockType = cells[0], start = 0;

    for (let i = 1; i < cells.length; i++) {

      if (blockType !== cells[i]) {
        blocks[blockType].push([ start, i - 1 ]);
        blockType = cells[i];
        start = i;
      }
    }

    blocks[blockType].push([ start, cells.length - 1 ]);

    return blocks;
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

  detectBlockClue(block, distribution) {
    const [ startBlock, endBlock ] = block;

    const blockLength = endBlock - startBlock + 1;

    // at least one cell might be assigned to one clue
    for (let i = startBlock; i <= endBlock; i++) {
      const cellClues = distribution[i];
      const blockClue = cellClues[0];
      if (cellClues.length === 1) {
        return blockClue;
      }
    }

    for (let i = startBlock; i <= endBlock; i++) {
      const cellClues = distribution[i];

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

  preBuildBounds(distribution) {
    const bounds = [];

    for (let i = 0; i < distribution.length; i++) {
      const cellClues = distribution[i];
      for (let j = 0; j < cellClues.length; j++) {
        const clueIndex = cellClues[j][1];

        if (!bounds[clueIndex]) {
          bounds[clueIndex] = [ [ i, i ] ];
        } else {
          const lastBounds = bounds[clueIndex][bounds[clueIndex].length - 1];
          if (i - lastBounds[1] > 1) {
            bounds[clueIndex].push([ i, i ]);
          } else {
            lastBounds[1] = i;
          }
        }
      }
    }

    return bounds;
  },

  filterShortBounds(bounds, clues) {
    return bounds.map((clueBounds, clueIndex) => (
      clueBounds.filter(bounds => bounds[1] - bounds[0] + 1 >= clues[clueIndex])
    ));
  },

  buildBounds(distribution, clues) {
    const bounds = solveUtils.preBuildBounds(distribution);
    return solveUtils.filterShortBounds(bounds, clues);
  },

  bouncing(block, blockClue, distribution) {

    const [ start, end ] = block;
    const blockLength = end - start + 1;
    const delta = blockClue - blockLength;
    
    let i = end, c = 0;

    while (i < distribution.length - 1 && distribution[i++].length > 0) {
      c++;
    }

    const d = delta - c + 1;

    if (d > 0) {
      return [ start - d, start - 1 ];
    }

    return null;
  },

  getAbsoluteIndex(lineIndex, side, cellIndex) {
    return converters[side](lineIndex, cellIndex);
  },

  getAbsoluteIndexes(lineIndex, side, indexes) {
    return indexes.map(index => solveUtils.getAbsoluteIndex(lineIndex, side, index));
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
