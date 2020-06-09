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

function getPerpendicularLine(cell, line) {
  return cell.lines.find(l => l !== line);
}

function markAsEmpty(line, index) {
  const cell = line.cells[index];
  const changed = cell.value === 0;
  cell.value = 2;
  const pl = getPerpendicularLine(cell, line);
  pl.distribution[pl.cells.indexOf(cell)] = [];
  line.distribution[index] = [];
  return changed;
}

function markAsFilled(line, index) {
  const cell = line.cells[index];
  const changed = cell.value === 0;
  cell.value = 1;
  return changed;
}

function getBlockAttributes(bounds, cells, distribution) {
  const [ start, end ] = bounds;
  const length = end - start + 1;

  const isWrapped = (
    (bounds[0] === 0 || cells[bounds[0] - 1] === 2) &&
    (bounds[1] === cells.length - 1 || cells[bounds[1] + 1] === 2)
  );

  const clue = solveUtils.detectBlockClue(bounds, distribution);

  if (clue === null) {
    return { isWrapped, length };
  }

  return { clue, solved: length === clue[0], isWrapped, length }
}


function onEmptyBlock(start, end, line) {
  return false;
}

function onFilledBlock(start, end, line) {
  const cells = line.cells.map(cell => cell.value);
  let changed = false;

  for (let i = start; i <= end; i++) {
    if (line.distribution[i].length === 0) {
      changed = markAsEmpty(line, i) || changed
    }
  }

  let { clue, solved, isWrapped, length } = getBlockAttributes([ start, end ], cells, line.distribution);

  if (isWrapped) {
    for (let i = start; i <= end; i++) {
      const cellClues = line.distribution[i];
      line.distribution[i] = cellClues.filter(clue => clue[0] === length);

      if (line.distribution[i].length < cellClues.length) {
        changed = true;
      }
    }
  }

  if (solved) {
    const empty = lineSolvers.wrapSolvedBlock(line, [ start, end ]);

    if (empty.length > 0) {
      changed = true;
      empty.forEach(emptyIndex => {
        changed = markAsEmpty(line, emptyIndex) || changed;
      });
    }

    let isFirst = true

    for (let i = 0; i < start; i++) {
      if (line.distribution[i].length > 0) {
        isFirst = false;
        break
      }
    }

    if (isFirst) clue = [ clue[0], 0 ]

    if (clue.length === 2) {

      for (let i = start; i <= end; i++) {
        if (line.distribution[i].length > 1) changed = true
        line.distribution[i] = [ clue ];
      }

      for (let i = 0; i < start; i++) {
        const cellClues = line.distribution[i].filter(cellClues => cellClues[1] !== clue[1]);

        if (cellClues.length < line.distribution[i].length) {
          line.distribution[i] = cellClues;
          changed = true;
        }
      }

      for (let i = end + 1; i < line.cells.length; i++) {
        const cellClues = line.distribution[i].filter(cellClues => cellClues[1] !== clue[1]);

        if (cellClues.length < line.distribution[i].length) {
          line.distribution[i] = cellClues;
          changed = true;
        }
      }
    }
  } else if (clue && clue.length === 2) {
    
    const [ clueValue, clueIndex ] = clue
    const delta = clueValue - length;

    for (let i = 0; i < start - delta; i++) {
      const cellClues = line.distribution[i].filter(c => c[1] !== clueIndex);
      if (cellClues.length === 0) {
        changed = markAsEmpty(line, i) || changed
      }

      if (cellClues.length < line.distribution[i].length) {
        line.distribution[i] = cellClues;
        changed = true;
      }
    }

    for (let i = end + delta + 1; i < line.distribution.length; i++) {
      const cellClues = line.distribution[i].filter(c => c[1] !== clueIndex);
      if (cellClues.length === 0) {
        changed = markAsEmpty(line, i) || changed
      }

      if (cellClues.length < line.distribution[i].length) {
        line.distribution[i] = cellClues;
        changed = true;
      }
    }
  }

  return changed;
}

function onUnknownBlock(start, end, line) {
  let changed = false;

  for (let i = start; i <= end; i++) {
    if (line.distribution[i].length === 0) {
      changed = markAsEmpty(line, i) || changed
    }
  } 

  if (
    (start === 0 || line.cells[start - 1].value === 2) &&
    (end === line.cells.length - 1 || line.cells[end + 1].value === 2)
  ) {
    const bclue = solveUtils.detectBlockClue([ start, end ], line.distribution);

    if (bclue && bclue[0] > end - start + 1) {
      for (let i = start; i <= end; i++) {
        if (line.cells[i].value === 0) changed = markAsEmpty(line, i) || changed
      }
    }
  }

  return changed;
}

const blockProcessors = [ onUnknownBlock, onFilledBlock, onEmptyBlock ];

function processBlocks(blocks, line) {
  let changed = false;

  blocks.forEach((blockType, index) => {
    const process = blockProcessors[index];
    blockType.forEach(block => {
      changed = process(block[0], block[1], line) || changed;
    });
  });

  return changed;
}

if (typeof window !== 'undefined') {
  window.__solveLine__ = solveLine;
}

function solveLine(line) {

  let changed = false;

  const cells = line.cells.map(c => c.value);

  const blocks = solveUtils.getBlocks(cells);

  const lineBounds = solveUtils.buildBounds(line.distribution, line.clues);

  for (let i = 0; i < lineBounds.length; i++) {
    const clueBounds = lineBounds[i];

    if (clueBounds.length === 1) {
      const block = lineSolvers.solveBounds(line, clueBounds[0], line.clues[i]);

      if (block !== null) {
        changed = fillBlock(line, block) || changed;
      }
    }
  }

  changed = processBlocks(blocks, line) || changed;

  return changed;
}

module.exports = solveLine;
