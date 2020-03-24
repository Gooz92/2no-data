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

  const flatField = solveUtils.toFlatArray(nonogram.rows);
  return flatField;
};
