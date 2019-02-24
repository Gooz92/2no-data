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

function solveBounds(line) {
  const filled = [];

  line.clues.forEach(({ value, bounds: { max: { left, right } } }) => {
    for (let i = right - value + 1; i < left + value; i++) {
      line.cells[i].value = 1;
      filled.push(i);
    }
  });

  return filled;
}

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
      line.cells[i].value = 1;
      filled.push(i);
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

    // if (left > bounds.min.left) {
     
    //   bounds.min.left = left;

    //   if (bounds.min.right - bounds.min.left + 1 < value) {
    //     bounds.min.right = bounds.min.left + value - 1;
    //   }
    // }

    // if (right < bounds.min.right) {
    //   bounds.min.right = right;

    //   if (bounds.min.right - bounds.min.left + 1 < value) {
    //     bounds.min.left = bounds.min.right - value + 1;
    //   }
    // }
  }));

  line.clues.forEach(({ value, bounds }) => {
    let { left, right } = bounds.min;

    if (right === 2) debugger;

    while (line.cells[left].value === 2) {
      ++left;
    }

    while (line.cells[right].value === 2) {
      --right;
    }
    
    bounds.min.left = left;
    bounds.min.right = right;
  });
}

export function buildNonogram(rawRowClues, rawColClues) {

  const rowClues = buildSideClues(rawRowClues);
  const colClues = buildSideClues(rawColClues);

  const rows = generateArray(rowClues.length, rowIndex => {
    calculateBounds(rowClues[rowIndex], colClues.length);
    return {
      clues: rowClues[rowIndex],
      cells: generateArray(colClues.length, () => ({}))
    };
  });
  
  const cols = generateArray(colClues.length, colIndex => {
    calculateBounds(colClues[colIndex], rowClues.length);
    return {
      clues: colClues[colIndex],
      cells: []
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

  nonogram.rows.forEach((line, index) => {
  
    const filled = solveBounds(line).map(i => [ index, i ]);

    onFill(filled);
  });

  let i = 1000;

  do {

    nonogram.cols.forEach((line, index) => {

      const filled = solveBounds(line).map(i => [ i, index ]);

      onFill(filled);

      const joined = joinBlocks(line).map(i => [ i, index ]);

      onFill(joined);

      const empty = findEmptySpaces(line).map(i => [ i, index ]);

      onEmpty(empty);

      narrowBounds(line);

    });

    nonogram.rows.forEach((line, index) => {

      const filled = solveBounds(line).map(i => [ index, i ]);

      onFill(filled);

      const joined = joinBlocks(line).map(i => [ index, i ]);

      onFill(joined);

      const empty = findEmptySpaces(line);

      onEmpty(empty.map(i => [ index, i ]));

      narrowBounds(line);
    });
  } while (i-- > 0);

}