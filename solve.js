const solveUtils = require('./solve.utils.js'),
  buildNono = require('./build-nono.js'),
  createSolver = require('./create-solver.js');

module.exports = (hClues, vClues) => {

  const nonogram = buildNono(hClues, vClues);

  const solver = createSolver(nonogram);

  let line;

  do {
    line = solver.solveNextLine();
  } while (line);

  const rows = nonogram.rows.map(row => {
    const cells = row.cells.map(c => c.value);
    const blocks = row.blocks.map(block => block.bounds);
    solveUtils.fillBlocks(blocks, cells);
    return cells;
  });

  const flatField = solveUtils.toFlatArray(rows);
  return flatField;
};
