const { forEachFile } = require('./file.utils.js');

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

function buildField(colCount, rowCount) {
  const rows = generateArray(rowCount, () => generateArray(colCount, () => ({})));
  const cols = generateArray(colCount, () => []);

  for (let i = 0; i < rowCount; i++) {
    for (let j = 0; j < colCount; j++) {
      cols[j][i] = rows[i][j];
    }
  }

  return { rows, cols, lines: [ ...rows, ...cols ] };
}

forEachFile('./data/bw', file => {
  console.log(file);
  const [ hClues, vClues ] = require(file);
  const field = buildField(vClues.length, hClues.length);
});
