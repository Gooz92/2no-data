// const { forEachFile } = require('./file.utils.js');

function generateArray(length, generateItem) {
  const array = [];

  for (let i = 0; i < length; i++) {
    array.push(generateItem(i));
  }

  return array;
}

function getRights(clues) {
  const rights = [];
  let right = 0;

  for (let i = 0; i < clues.length; i++) {
    rights.push(right + clues[i] - 1);
    right += clues[i] + 1;
  }

  return rights;
}

function getLefts(clues, length) {
  const lefts = [];
  let left = 0;

  for (let i = clues.length - 1; i >= 0; i--) {
    lefts.unshift(left + clues[i] - 1);
    left += clues[i] + 1;
  }

  return lefts.map(left => length - left - 1);
}

function maxBounds(clues, length) {
  const maxLefts = [ 0 ];
  const maxRights = [ length - 1 ];

  let left = 0, right = length - 1;

  for (let i = 0; i < clues.length - 1; i++) {
    maxLefts.push(left += clues[i] + 1);
    maxRights.unshift(right -= clues[clues.length - i - 1] + 1);
  }

  return maxLefts.map((left, index) => [left, maxRights[index]]);
}

export function buildNonogram(rowClues, colClues) {

  const rows = generateArray(rowCount, rowIndex => ({
    clues: rowClues[rowIndex],
    cells: generateArray(colCount, () => ({}))
  }));
  
  const cols = generateArray(colCount, colIndex => ({
    clues: colClues[colIndex],
    cells: []
  }));

  for (let i = 0; i < rowCount; i++) {
    for (let j = 0; j < colCount; j++) {
      cols[j].cells[i] = rows[i][j];
    }
  }

  return {
    rowClues, colClues,
    rows, cols,
    lines: [ ...rows, ...cols ]
  };
}

export function solve(nonogram) {
  nonogram.lines.forEach(line => {
    const bounds = maxBounds(line.clues, line.cells.length);

    bounds.forEach(([ left, right ], index) => {
      const clue = line.clues[index];

      for (let i = right - clue - 1; i < left + clue; i++) {
        line.cells[i].value = 1;
      }

    });

  });
}

const clues = [ 1, 2, 3 ], length = 9;

const bounds = maxBounds(clues, length);

console.log(bounds);
