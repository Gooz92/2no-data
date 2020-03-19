import { createDiv, omit } from './utils.js';
const solve = require('../solve.js');

const [ hClues, vClues ] = require('../data/bw/10x10/155.json');

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

      const options = getOptions(i, j);
      const attributes = omit(options, ['styles', 'classes']);

      const cell = createDiv({
        className: (options.classes || []).concat(classes).join(' '),
        styles: {
          width: cellSize - (isLastCol ? 0 : 1),
          height: cellSize - (isLastRow ? 0 : 1),
          ...options.styles
        },
        ...attributes
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

function buildField(hClues, vClues, cellSize) {

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
    id: `cell-${i}-${j}`,
    onclick: e => {
      e.target.classList.remove('empty');
      e.target.classList.toggle('filled');
    },
    oncontextmenu: e => {
      e.preventDefault();
      e.target.classList.remove('filled');
      e.target.classList.toggle('empty');
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

const field = buildField(hClues, vClues, 42);

window.__export2no__ = exportField;
window.__draw__ = drawField;

document.addEventListener('DOMContentLoaded', () => {
  document.body.appendChild(field);

  const solution = solve(hClues, vClues);
  drawField(solution, hClues.length, vClues.length);
});

function drawField(flatField, rowCount, colCount) {
  for (let i = 0; i < rowCount; i++) {
    for (let j = 0; j < colCount; j++) {
      const index = i * colCount + j;
      const cellSate = flatField[index];

        if(cellSate > 0) {
        const className = [ 'filled', 'empty' ][cellSate - 1];
        document.getElementById(`cell-${i}-${j}`).classList.add(className);
      }
    }
  }
}

function exportField() {
  const field = [];

  for (let i = 0; i < hClues.length; i++) {
    for (let j = 0; j < vClues.length; j++) {
      field.push(
        document.getElementById(`cell-${i}-${j}`).classList.contains('filled') ? 1 : 0
      );
    }
  }

  return field;
}
