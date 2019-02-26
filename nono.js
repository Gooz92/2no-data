import { generateArray } from './utils.js';

const buildSideClues = sideClues => (
  sideClues.map(lineClues => (
    lineClues.map(clue => ({ value: clue }))
  ))
);

function calculateBounds(clues, length) {
  const maxLefts = [ 0 ];
  const maxRights = [ length - 1 ];

  let left = 0, right = length - 1;

  for (let i = 0; i < clues.length - 1; i++) {
    maxLefts.push(left += clues[i].value + 1);
    maxRights.unshift(right -= clues[clues.length - i - 1].value + 1);
  }

  clues.forEach((clue, index) => {
    clue.bounds = {
      max: {
        left: maxLefts[index],
        right: maxRights[index]
      },
      min: {
        left: index > 0 ? maxRights[index - 1] + 1 : 0,
        right: index < clues.length - 1 ? maxLefts[index + 1] - 1 : length - 1
      }
    }
  });
}

const tokens = [ '-', '#', 'X' ];

function stringifyLine(line, markIndex) {
  const clues = line.clues
    .map(clue => clue.value)
    .join(' ');
  
  const cells = line.cells.map((cell, index) => (
    index === markIndex ? '*' : tokens[cell.value || 0]
  )).join('');

  return `${clues}|${cells}`;
}

function markAsFilled(line, index, filled) {
  const cell = line.cells[index];

  if (!cell.value) {
    cell.value = 1;
    filled.push(index);
  }
}

const converters = [
  (lineIndex, index) => [ lineIndex, index ],
  (lineIndex, index) => [ index, lineIndex ]
];

const absoluteIndexes = solveLine => (
  line => solveLine(line).map(index => converters[line.side](line.index, index))
);

const solveBounds = absoluteIndexes(line => {
  const filled = [];

  line.clues.forEach(({ value, bounds: { max: { left, right } } }) => {
    for (let i = right - value + 1; i < left + value; i++) {
      markAsFilled(line, i, filled);
    }
  });

  return filled;
});

function joinBlocks(line) {
  const filled = [];

  line.clues.forEach(({ bounds: { min: { left, right } } }) => {
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
      markAsFilled(line, i, filled);
    }
  });

  return filled;
}

function findEmptySpaces(line) {
  const emptyCells = [];

  line.clues.forEach(({ value, bounds }) => {

    const { left, right } = bounds.min;

    let blockLength = 0, startIndex = left;

    for (let i = left; i <= right; i++) {
      if (line.cells[i].value === 1) {
        if (blockLength === 0) startIndex = i;
        ++blockLength;
      }
    }

    if (blockLength === 0) return;

    const delta = value - blockLength;

    const start = startIndex - delta;
    const end = startIndex + blockLength + delta;

    if (blockLength === value) {
      if (startIndex - 1 >= 0) {
        emptyCells.push(startIndex - 1);
        line.cells[startIndex - 1].value = 2;

      }
      if (end < line.cells.length) {
        emptyCells.push(end);
        line.cells[end].value = 2;
      }
    }

    for (let i = left; i < start; i++) {
      emptyCells.push(i);
      line.cells[i].value = 2;
    }

    for (let i = right; i >= end; i--) {
      emptyCells.push(i);
      line.cells[i].value = 2;
    }
  });

  return emptyCells;
}

function narrowBounds(line) {
  line.clues.forEach((({ value, bounds }) => {
    let { left, right } = bounds.max;

    while (line.cells[left].value === 2) {
      ++left;
    }

    while (line.cells[right].value === 2) {
      --right;
    }

    bounds.max.left = left;
    bounds.max.right = right;

    if (left > bounds.min.left) {
     
      bounds.min.left = left;

      if (bounds.min.right - bounds.min.left + 1 < value) {
        bounds.min.right = bounds.min.left + value - 1;
      }
    }

    if (right < bounds.min.right) {
      bounds.min.right = right;

      if (bounds.min.right - bounds.min.left + 1 < value) {
        bounds.min.left = bounds.min.right - value + 1;
      }
    }
  }));
}

function toPlainField(rows) {
  const field = [];

  return rows.forEach(row => {
    row.forEach(cell => {
      field.push(cell.value || 0);
    });
  });
}

function isMatch(actual, solved) {
  return solved.every((cell, index) => [
    () => true,
    cell => cell === 1,
    cell => cell === 0
  ][cell](solved[idnex]));
}

export function buildNonogram(rawRowClues, rawColClues) {

  const rowClues = buildSideClues(rawRowClues);
  const colClues = buildSideClues(rawColClues);

  const rows = generateArray(rowClues.length, rowIndex => {
    calculateBounds(rowClues[rowIndex], colClues.length);
    return {
      clues: rowClues[rowIndex],
      cells: generateArray(colClues.length, () => ({})),
      side: 0,
      index: rowIndex
    };
  });
  
  const cols = generateArray(colClues.length, colIndex => {
    calculateBounds(colClues[colIndex], rowClues.length);
    return {
      clues: colClues[colIndex],
      cells: [],
      side: 1,
      index: colIndex
    };
  });

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

export function solve(nonogram, onFill, onEmpty) {

  let changed, i = 0;

  do {
    changed = false;

    nonogram.lines.forEach(line => {
      const filled = solveBounds(line);

      if (filled.length > 0) {
        onFill(filled);
        changed = true;
      }
    });
    ++i;
  } while (changed);

  console.log(i);
}