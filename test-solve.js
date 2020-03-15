const fs = require('fs');

const { forEachFile } = require('./file.utils.js');
const solve = require('./solve.js');
const { isValid } = require('./validate.js');
const { getResult, stringifyResults } = require('./result.utils.js');

function getPercentage(solution) {
  let solvedCells = 0;

  solution.forEach(cell => {
    if ([ 1, 2 ].includes(cell)) {
      solvedCells++;
    }
  });

  return `${(solvedCells / solution.length * 100).toFixed(2)}%`;
}

const results = [];

forEachFile('./data/bw/', (file, fileName) => {
  const [ hClues, vClues, field ] = require(file);
  const solution = solve(hClues, vClues);
  const result = getResult(solution);
  results.push([ `"${fileName}"`, ...result ]);
  console.log(file, getPercentage(solution), getResult(solution), isValid(solution, field));
});

fs.writeFileSync('results.json', stringifyResults(results));