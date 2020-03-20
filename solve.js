const solveUtils = require('./solve.utils.js'),
  buildNono = require('./build-nono.js'),
  createSolver = require('./create-solver.js');

module.exports = (hClues, vClues) => {

  const nonogram = buildNono(hClues, vClues);

  const solver = createSolver(nonogram);

  do {
    solver.step();
  } while (solver.changed);

  const flatField = solveUtils.toFlatArray(nonogram.rows);
  return flatField;
};
