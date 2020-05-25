const solveUtils = require('./solve.utils.js'),
  lineSolvers = require('./line-solvers.js');

function fillBlock(line, blockBounds) {
  const [ start, end ] = blockBounds;

  let changed = false;

  for (let i = start; i <= end; i++) {
    changed = markAsFilled(line, i) || changed;
  }

  return changed;
}

function markAsEmpty(line, index) {
  const cell = line.cells[index];  
  const changed = cell.value === 0;
  cell.value = 2;
  line.distribution[index] = [];
  return changed;
}

function markAsFilled(line, index) {
  const cell = line.cells[index];
  const changed = cell.value === 0;
  cell.value = 1;
  return changed;
}

function getBlocks(line) {
  
  const cells = line.cells.map(cell => cell.value);

  const blocks = solveUtils.getFilledBlocks([ 0, line.cells.length ], cells);

  return blocks.map(bounds => {
    const block = { bounds };
    const [ start, end ] = bounds;
    const blockLength = end - start + 1;

    const isWrapped = (
      (bounds[0] === 0 || cells[bounds[0] - 1] === 2) &&
      (bounds[1] === cells.length - 1 || cells[bounds[1] + 1] === 2)
    );

    block.isWrapped = isWrapped;
    block.length = blockLength;

    const clue = solveUtils.detectBlockClue(bounds, line.distribution);

    if (clue === null) {
      return block;
    }

    block.clue = clue;
    block.solved = clue[0] === blockLength;

    return block;
  });
}

function processBlocks(line, blocks) {

  let changed = false;

  if (blocks.length === line.clues.length && blocks.every(b => b.solved)) {
    line.cells.forEach((c, i) => {
      if (c.value === 0) changed = markAsEmpty(line, i) || changed;
    });
    return
  }

  blocks.forEach((block, index) => {

    if (block.isWrapped) {
      for (let i = block.bounds[0]; i <= block.bounds[1]; i++) {
        const cellClues = line.distribution[i];
        line.distribution[i] = cellClues.filter(clue => clue[0] === block.length);

        if (line.distribution[i].length < cellClues.length) {
          changed = true;
        }
      }
    }

    if (block.solved) {
      const empty = lineSolvers.wrapSolvedBlock(line, block);

      if (empty.length > 0) {
        changed = true;
        empty.forEach(emptyIndex => {
          changed = markAsEmpty(line, emptyIndex) || changed;
        });
      }

      if (block.clue.length === 2) {

        for (let i = 0; i < block.bounds[0]; i++) {
          const cellClues = line.distribution[i].filter(cellClues => cellClues[1] !== block.clue[1]);

          if (cellClues.length < line.distribution[i].length) {
            line.distribution[i] = cellClues;
            changed = true;
          }

          if (cellClues.length === 1 && cellClues[0][1] === block.clue[1]) {
            changed = markAsEmpty(line, i) || changed
          }
        }
  
        for (let i = block.bounds[1] + 1; i < line.cells.length; i++) {
          const cellClues = line.distribution[i].filter(cellClues => {
            return cellClues[1] !== block.clue[1]
          });

          if (cellClues.length < line.distribution[i].length) {
            line.distribution[i] = cellClues;
            changed = true;
          }
        
          if (cellClues.length === 1 && cellClues[0][1] === block.clue[1]) {
            changed = markAsEmpty(line, i) || changed
          }
        }

        for (let i = block.bounds[0]; i <= block.bounds[1]; i++) {
          if (line.distribution[i].length > 1) changed = true
          line.distribution[i] = [ block.clue ];
        }
      }

    } else if (block.clue && block.clue.length === 2) {
      const filled = solveUtils.glue(block.clue[0], block.bounds, line.bounds[block.clue[1]]);
      if (filled.length > 0) {
        filled.forEach(index => {
          if (line.cells[index].value !== 1) {
            changed = markAsFilled(line, index) || changed;
          }
        });
      }

      const [ startBlock, endBlock ] = block.bounds;
      const [ clueValue, clueIndex ] = block.clue;
      const blockLength = endBlock - startBlock + 1;
      const delta = clueValue - blockLength;

      for (let i = 0; i < startBlock - delta; i++) {
        const cellClues = line.distribution[i];
        if (cellClues.length === 1 && cellClues[0][1] === clueIndex) {
          changed = markAsEmpty(line, i) || changed
        }
      }

      for (let i = endBlock + delta + 1; i < line.distribution.length; i++) {
        const cellClues = line.distribution[i];
        if (cellClues.length === 1 && cellClues[0][1] === clueIndex) {
          changed = markAsEmpty(line, i) || changed
        }
      }
    }
  });

  return changed;
}

if (typeof window !== 'undefined') {
  window.__solveLine__ = solveLine;
}

function solveLine(line) {

  let changed = false;

  const cells = line.cells.map(c => c.value);

  line.bounds.forEach((bounds, index) => {
    const newBounds = solveUtils.narrowBounds(bounds, cells, index, line.distribution);

    if (newBounds[0] > bounds[0]) {
      bounds[0] = newBounds[0];
      changed = true;
    }

    if (newBounds[1] < bounds[1]) {
      bounds[1] = newBounds[1];
      changed = true;
    }

    const block = lineSolvers.solveBounds(line, bounds, index);

    if (block !== null) {
      changed = fillBlock(line, block) || changed;
    }

    if (solveUtils.narrowCluesDistribution(index, line)) {
      changed = true;
    }

    // mark hole as empty if it cannot contain block 
    const clue = line.clues[index];
    const emptyBlocks = solveUtils.getEmptyBlocks(bounds, cells);
    emptyBlocks.forEach(block => {
      const bclue = solveUtils.detectBlockClue(block, line.distribution);

      if (bclue && bclue[0] === clue && clue > block[1] - block[0] + 1) {
        for (let i = block[0]; i <= block[1]; i++) {
          if (cells[i] === 0) changed = markAsEmpty(line, i) || changed
        }
      }
    });

  });

  line.cells.forEach((cell, index) => {
    if (line.distribution[index].length === 0) changed = markAsEmpty(line, index) || changed
  })

  const blocks = getBlocks(line);

  changed = processBlocks(line, blocks) || changed;

  return changed;
}

module.exports = solveLine;
