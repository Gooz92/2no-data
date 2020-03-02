
const solveUtils = require('./solve.utils.js');

module.exports = (hClues, vClues) => {
  const nono = solveUtils.build(hClues, vClues);
  const flatField = solveUtils.toFlatArray(nono.rows);
  return flatField;
};
