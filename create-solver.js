const lineSolvers = require('./line-solvers.js');

function getOppositeLine(cell, currentLine) {
  return cell.lines.find(line => line !== currentLine);
}

function fillBlock(line, blockBounds) {
  const [ start, end ] = blockBounds;

  for (let i = start; i <= end; i++) {
    const cell = line.cells[i];
    const opLine = getOppositeLine(cell, line);

    cell.value = 1;
    opLine.changed = true;
  }
}

function markAsEmpty(line, cell) {
  cell.value = 2;
  const opLine = getOppositeLine(cell, line);
  opLine.changed = true;
}

function solveLine(line) {

  let changed = false;

  // if (!line.changed && !line.pristine) {
  //   return;
  // }

  line.bounds.forEach((bounds, index) => {
    const block = lineSolvers.solveBounds(line, bounds, index);

    if (block !== null && !line.blocks.find(b => b.clue[1] === block.clue[1])) {
      line.blocks.push(block);
      fillBlock(line, block.bounds);
      changed = true;
    }
  });

  line.blocks.forEach(block => {

    if (block.solved) return;

    const blockLength = block.bounds[1] - block.bounds[0] + 1;

    if (blockLength === block.clue[0]) {
      block.solved = true;
      const empty = lineSolvers.wrapSolvedBlock(line, block);

      if (empty.length > 0) {
        changed = true;
        empty.forEach(emptyIndex => {
          markAsEmpty(line, line.cells[emptyIndex]);
        });
      }

      return
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
