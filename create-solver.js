const lineSolvers = require('./line-solvers.js');
const solveUtils = require('./solve.utils.js');

function getOppositeLine(cell, currentLine) {
  return cell.lines.find(line => line !== currentLine);
}

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
  cell.value = 2;
  const opLine = getOppositeLine(cell, line);
  opLine.changed = true;
}

function markAsFilled(line, index) {
  const cell = line.cells[index];
  const changed = cell.value === 0;
  cell.value = 1;
  const opLine = getOppositeLine(cell, line);
  opLine.changed = true;
  return changed;
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
      changed = fillBlock(line, block.bounds) || changed;
    }
  });

  const blocks = solveUtils.getFilledBlocks([ 0, line.cells.length ], cells)
    .map(bounds => {
      const block = { bounds };
      const [ start, end ] = bounds;
      const blockLength = end - start + 1;
      const clue = solveUtils.detectBlockClue(bounds, line.distribution);

      if (clue === null) {
        return block;
      }

      block.clue = clue;
      block.solved = clue[0] === blockLength;

      return block;
    });

  blocks.forEach(block => {

    if (!block.clue) {
      return
    }

    if (block.solved) {
      const empty = lineSolvers.wrapSolvedBlock(line, block);

      if (empty.length > 0) {
        changed = true;
        empty.forEach(emptyIndex => {
          markAsEmpty(line, emptyIndex);
        });
      }
    } else if (block.clue.length === 2) {
      const filled = solveUtils.glue(block.clue[0], block.bounds, line.bounds[block.clue[1]]);
      if (filled.length > 0) {
        filled.forEach(index => {
          if (line.cells[index].value !== 1) {
            changed = true;
            markAsFilled(line, index);
          }
        });
      }
    }
  });

  line.pristine = false;
  line.changed = false;

  return changed;
}

module.exports = function createSolver(nonogram) {

  return {
    nonogram,

    lineIndex: 0,

    changed: false,

    nextLine() {

      if (this.lineIndex === this.nonogram.lines.length) {

        if (!this.changed) {
          return null;
        }

        this.changed = false;
        this.lineIndex = 0;
      }

      return this.nonogram.lines[this.lineIndex++];
    },

    solveNextLine() {
      const line = this.nextLine();

      if (line === null) {
        return null;
      }

      if (solveLine(line)) {
        this.changed = true;
      }

      return line;
    }
  };
};
