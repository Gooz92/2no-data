import { createDiv } from './utils.js';
import { buildNonogram } from '../solve.js';

const [ hClues, vClues ] = require('../data/bw/5x5/cat.json');

function appendCells(field, colCount, rowCount, cellSize, getOptions = () => ({})) {

  for (let i = 0; i < rowCount; i++) {
    for (let j = 0; j < colCount; j++) {

      const classes = [];

      const isLastRow = i === rowCount - 1;
      const isLastCol = j === colCount - 1;

      if (!isLastRow) {
        classes.push('bottom-border');
      }

      if (!isLastCol) {
        classes.push('right-border');
      }

      const cell = createDiv({
        styles: {
          width: cellSize - (isLastCol ? 0 : 1),
          height: cellSize - (isLastRow ? 0 : 1)
        },
        className: classes.join(' '),
        ...getOptions()
      });
  
      field.appendChild(cell);
    }
  }
}

const findLongestClueLength = clues => (
  Math.max(...clues.map(clue => clue.length))
);

function appendVClues(container, clues, height) {
  for (let i = 0; i < clues.length; i++) {
    const dh = height - clues[i].length;
    for (let j = 0; j < clues[i].length; j++) {
      const index = clues.length * (dh + j) + i;
      container.childNodes[index].innerHTML = clues[i][j];
    }
  }
}

function appendHClues(container, clues, width) {
  for (let i = 0; i < clues.length; i++) {
    const dw = width - clues[i].length;
    for (let j = 0; j < clues[i].length; j++) {
      const index = width * i + dw + j;
      container.childNodes[index].innerHTML = clues[i][j];
    }
  }
}

function buildField(nonogram, cellSize) {

  const vClues = nonogram.colClues;
  const hClues = nonogram.rowClues;

  const vCluesHeight = findLongestClueLength(vClues) * cellSize;
  const hCluesWidth = findLongestClueLength(hClues) * cellSize;

  const fieldWidth = vClues.length * cellSize;
  const fieldHeight = hClues.length * cellSize;

  const nonogramWidth = fieldWidth + hCluesWidth + 1;
  const nonogramHeight = fieldHeight + vCluesHeight + 1;

  const container = createDiv({
    className: 'nonogram',
    styles: {
      width: nonogramWidth,
      height: nonogramHeight
    }
  });

  const corner = createDiv({
    className: 'corner',
    styles: {
      width: hCluesWidth,
      height: vCluesHeight
    }
  }); 

  const vCluesContainer = createDiv({
    className: 'v-clues',
    styles: {
      width: fieldWidth,
      height: vCluesHeight
    }
  });

  const hCluesContainer = createDiv({
    className: 'h-clues',
    styles: {
      width: hCluesWidth,
      height: fieldHeight
    }
  });

  const field = createDiv({
    className: 'field',
    styles: {
      width: fieldWidth,
      height: fieldHeight
    }
  });

  appendCells(field, vClues.length, hClues.length, cellSize, (i, j) => ({
    styles: {
      backgroundColor: nonogram.rows[i][j].value ? 'black' : 'white'
    },
    onclick: e => {
      e.target.style.backgroundColor = 'black';
    }
  }));

  appendCells(vCluesContainer, vClues.length, findLongestClueLength(vClues), cellSize);
  appendVClues(vCluesContainer, vClues, findLongestClueLength(vClues));
  appendCells(hCluesContainer, findLongestClueLength(hClues), hClues.length, cellSize);
  appendHClues(hCluesContainer, hClues, findLongestClueLength(hClues));

  container.appendChild(corner);
  container.appendChild(vCluesContainer);
  container.appendChild(hCluesContainer);
  container.appendChild(field);

  return container;
}

document.addEventListener('DOMContentLoaded', () => {
  const nonogram = buildNonogram(hClues, vClues);
  console.log(nonogram);
});
