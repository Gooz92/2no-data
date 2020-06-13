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

function parseData(data) {
  if (Array.isArray(data)) {
    const [ hClues, vClues, field ] = data;
    return { clues: [ hClues, vClues ], field };
  }

  return { clues: data.clues };
}

forEachFile('./data/bw/', (file, fileName) => {
  const data = require(file);
  const nono = parseData(data);
  const solution = solve(nono.clues[0], nono.clues[1]);
  const result = getResult(solution);
  results.push([ `"${fileName}"`, ...result ]);
  console.log(file, getPercentage(solution), getResult(solution), nono.field ? isValid(solution, nono.field) : '?');
});

fs.writeFileSync('results.json', stringifyResults(results));