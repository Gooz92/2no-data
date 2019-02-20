// const { forEachFile } = require('./file.utils.js');

function generateArray(length, generateItem) {
  const array = [];

  for (let i = 0; i < length; i++) {
    array.push(generateItem(i));
  }

  return array;
}

function getBounds(clues, length) {
  const maxLefts = [ 0 ];
  const maxRights = [ length - 1 ];

  let left = 0, right = length - 1;

  for (let i = 0; i < clues.length - 1; i++) {
    maxLefts.push(left += clues[i] + 1);
    maxRights.unshift(right -= clues[clues.length - i - 1] + 1);
  }

  const max = maxLefts.map((left, index) => [ left, maxRights[index] ]);

  return {
    max,
    min: max.map((bounds, index) => {
      const lmin = index > 0 ? max[index - 1][1] + 1 : 0;
      const rmin = index < max.length - 1 ? max[index + 1][0] - 1 : length - 1;

      return [ lmin, rmin ]; // lmin may be > rmin
    })
  };
}

function joinBlocks(line, bounds) {
  line.clues.forEach((clue, index) => {
    const [ left, right ] = bounds.min[index];

    let startIndex = left,
      endIndex = left;

    for (let i = left; i <= right; i++) {
      if (line.cells[i].value === 1) {
        if (startIndex === left) startIndex = i;
        endIndex = i;
      }
    }

    if (startIndex === endIndex) return;

    for (let i = startIndex; i <= endIndex; i++) {
      line.cells[i].value = 1;
    }

  });
}

function step(line, bounds) {
  line.clues.forEach((clue, index) => {
    const [ left, right ] = bounds.min[index];

    let blockLength = 0, startIndex = left;

    for (let i = left; i <= right; i++) {
      if (line.cells[i].value === 1) {
        if (blockLength === 0) startIndex = i;
        ++blockLength;
      } else if (blockLength === clue) {
        line.cells[i].value = 2;
      }
    }

    if (blockLength !== clue) {
      return;
    }

    if (startIndex - 1 >= 0) line.cells[startIndex - 1].value = 2;

    for (let i = left; i < startIndex; i++) {
      line.cells[i].value = 2;
    }
  });
}

export function buildNonogram(rowClues, colClues) {

  const rows = generateArray(rowClues.length, rowIndex => ({
    clues: rowClues[rowIndex],
    cells: generateArray(colClues.length, () => ({}))
  }));
  
  const cols = generateArray(colClues.length, colIndex => ({
    clues: colClues[colIndex],
    cells: []
  }));

  for (let i = 0; i < rowClues.length; i++) {
    for (let j = 0; j < colClues.length; j++) {
      cols[j].cells[i] = rows[i].cells[j];
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
    line.bounds = getBounds(line.clues, line.cells.length);

    line.bounds.max.forEach(([ left, right ], index) => {
      const clue = line.clues[index];

      for (let i = right - clue + 1; i < left + clue; i++) {
        line.cells[i].value = 1;
      }

    });

  });

  nonogram.lines.forEach(line => {
    joinBlocks(line, line.bounds);
    step(line, line.bounds);
  });
}

const bounds = getBounds([ 3, 2 ], 9);

console.log(bounds);