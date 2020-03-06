const { forEachFile } = require('./file.utils.js');
const solve = require('./solve.js');
const { isValid } = require('./validate.js');

function getPercentage(solution) {
  let solvedCells = 0;

  solution.forEach(cell => {
    if ([ 1, 2 ].includes(cell)) {
      solvedCells++;
    }
  });

  return `${(solvedCells / solution.length * 100).toFixed(2)}%`;
}

forEachFile('./data/bw/', file => {
  const [ hClues, vClues, field ] = require(file);
  const solution = solve(hClues, vClues);
  console.log(file, getPercentage(solution), isValid(solution, field));
});
