const { forEachFile } = require('./file.utils.js');
const solve = require('./solve.js');
const { isValid } = require('./validate.js');

forEachFile('./data/bw/5x5/', file => {
  const [ hClues, vClues, field ] = require(file);
  const solved = solve(hClues, vClues);
  console.log(isValid(solved, field));
});
