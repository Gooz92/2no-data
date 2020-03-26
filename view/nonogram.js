import { createDiv, omit } from './utils.js';

const solveUtils = require('../solve.utils.js'),
  utils = require('../utils.js');

function transpoe(m) {
  const mt = utils.generateArray(m[0].length, () => []);

  for (let i = 0; i < m.length; i++) {
    for (let j = 0; j < m[i].length; j++) {
      mt[j][i] = m[i][j];
    }
  }

  return mt;
}

function appendCells(field, colCount, rowCount, cellSize, getOptions = () => ({})) {

  const cells = [];

  for (let i = 0; i < rowCount; i++) {
    const row = [];
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
      row.push(cell);
    }
    cells.push(row);
  }

  return cells;
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

  const cells = appendCells(field, vClues.length, hClues.length, cellSize, (i, j) => ({
    id: buildCellId(i, j),
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

  const verticalClues = appendCells(vCluesContainer, vClues.length, findLongestClueLength(vClues), cellSize);

  appendVClues(vCluesContainer, vClues, findLongestClueLength(vClues));

  const horizontalClues = appendCells(hCluesContainer, findLongestClueLength(hClues), hClues.length, cellSize);

  appendHClues(hCluesContainer, hClues, findLongestClueLength(hClues));

  container.appendChild(corner);
  container.appendChild(vCluesContainer);
  container.appendChild(hCluesContainer);
  container.appendChild(field);

  return { element: container, cells, verticalClues: transpoe(verticalClues), horizontalClues };
}

function buildCellId(i, j) {
  return `cell-${i}-${j}`;
}

export default function (hClues, vClues, cellSize) {

  const { element, cells, verticalClues, horizontalClues } = buildField(hClues, vClues, cellSize);

  const component = {
    element,

    cells,

    verticalClues, horizontalClues,

    clues: [ horizontalClues, verticalClues ],

    exportField() {
      const field = [];
    
      for (let i = 0; i < hClues.length; i++) {
        for (let j = 0; j < vClues.length; j++) {
          field.push(
            component.getCell(i, j).classList.contains('filled') ? 1 : 0
          );
        }
      }
    
      return field;
    },

    drawField(flatField) {
      for (let i = 0; i < hClues.length; i++) {
        for (let j = 0; j < vClues.length; j++) {
          const index = i * vClues.length + j;
          const cellSate = flatField[index];
    
          if(cellSate > 0) {
            const className = [ 'filled', 'empty' ][cellSate - 1];
            component.cells[i][j].classList.add(className);
          }
        }
      }
    },

    drawLine(line) {
      line.cells.forEach((cell, index) => {
        const [ i, j ] = solveUtils.getAbsoluteIndex(line.index, line.side, index);
        const className = [ 'filled', 'empty' ][cell.value - 1];
        component.cells[i][j].classList.add(className);
      });
    },

    clearHighlighted() {
      if (!component.hightlighted) {
        return;
      }

      component.hightlighted.forEach(clue => {
        clue.classList.remove('hightlighted');
      });
    },

    highlight(clueCells) {
      component.hightlighted = clueCells;
      clueCells.forEach(clue => {
        clue.classList.add('hightlighted');
      });
    },

    highlightLine(lineIndex, side) {
      component.clearHighlighted();
      component.hightlighted = component.clues[side][lineIndex];
      component.hightlighted .forEach(clue => {
        clue.classList.add('hightlighted');
      });
    }
  };

  return component;
}