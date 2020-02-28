import { generateArray } from './utils.js';

const { simpleBlock, calculateBounds, getFilledBlocks, findEmptyCells } = require('./solve.utils.js');

const buildSideClues = sideClues => (
  sideClues.map(lineClues => (
    lineClues.map(clue => ({ value: clue }))
  ))
);


const FILLED = 1, EMPTY = 2;

function markAsFilled(line, index, filled) {
  const cell = line.cells[index];

  if (!cell.value) {
    cell.value = FILLED;
    filled.push(index);
  }
}

function markAsEmpty(line, index, empty) {
  const cell = line.cells[index];

  if (!cell.value) {
    cell.value = EMPTY;
    empty.push(index);
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

  line.clues.forEach(({ value }, index) => {
    const bounds = line.bounds[index];
    simpleBlock(value, bounds).forEach(i => {
      markAsFilled(line, i, filled);
    });
  });

  return filled;
});

const solveEmptyCells = absoluteIndexes(line => {

  const empty = [];

  line.clues.forEach(({ value }, index) => {
    const bounds = line.bounds[index];
    const filledBlocks = getFilledBlocks(bounds, line.cells.map(cell => cell.value));
    if (filledBlocks.length === 1) {
      const mask = cluesIndexesMask(line.bounds);
      findEmptyCells(value, index, filledBlocks[0], bounds, mask).forEach(index => {
        markAsEmpty(line, index, empty);
      });
    }
  });

  return empty;
});

export function buildNonogram(rawRowClues, rawColClues) {

  const rowClues = buildSideClues(rawRowClues);
  const colClues = buildSideClues(rawColClues);

  const rows = generateArray(rowClues.length, rowIndex => {
    const bounds = calculateBounds(rowClues[rowIndex].map(clue => clue.value), colClues.length);
    return {
      clues: rowClues[rowIndex],
      cells: generateArray(colClues.length, () => ({})),
      side: 0,
      bounds,
      index: rowIndex
    };
  });
  
  const cols = generateArray(colClues.length, colIndex => {
    const bounds = calculateBounds(colClues[colIndex].map(clue => clue.value), rowClues.length);
    return {
      clues: colClues[colIndex],
      cells: [],
      side: 1,
      index: colIndex,
      bounds
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

      // const emptyCells = solveEmptyCells(line);

      // if (emptyCells.length > 0) {
      //   onEmpty(emptyCells);
      //   changed = true;
      // }
  
    });
    ++i;
  } while (changed);

  console.log(i);
}