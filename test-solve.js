const { forEachFile } = require('./file.utils.js');
const solve = require('./solve.js');

forEachFile('./data/bw/5x5/', file => {
  const [ hClues, vClues ] = require(file);
  solve(hClues, vClues);
});
