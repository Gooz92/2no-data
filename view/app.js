const [ hClues, vClues ] = require('../data/bw/5x5/cat.json');

const px = value => `${value}px`;

const valueFn = value => value;

const cssValueConverters = {
  width: px,
  height: px
};

function createElement(tagName, options = {}) {
  const element = document.createElement(tagName);

  const properties = Object.keys(options)
    .filter(key => key !== 'styles')
    .reduce((props, key) => ({
      ...props,
      [ key ]: options[key]
    }), {});
  
  Object.assign(element, properties);
  
  const styles = options.styles || {};

  const adaptedStyles = Object.keys(styles)
    .reduce((acc, key) => ({
      ...acc,
      [key]: (cssValueConverters[key] || valueFn)(styles[key])
    }), {})

  Object.assign(element.style, adaptedStyles);

  return element;
}

const createDiv = options => createElement('div', options);

function appendCells(field, colCount, rowCount, cellSize, options = {}) {

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
        ...options
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

function buildNonogram(hClues, vClues, cellSize) {
  const vCluesHeight = findLongestClueLength(vClues) * cellSize;
  const hCluesWidth = findLongestClueLength(hClues) * cellSize;

  const fieldWidth = vClues.length * cellSize;
  const fieldHeight = hClues.length * cellSize;

  const nonogramWidth = fieldWidth + hCluesWidth + 1;
  const nonogramHeight = fieldHeight + vCluesHeight + 1;

  const nonogram = createDiv({
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

  appendCells(field, vClues.length, hClues.length, cellSize, {
    onclick: e => {
      e.target.style.backgroundColor = 'black';
    }
  });
  appendCells(vCluesContainer, vClues.length, findLongestClueLength(vClues), cellSize);
  appendVClues(vCluesContainer, vClues, findLongestClueLength(vClues));
  appendCells(hCluesContainer, findLongestClueLength(hClues), hClues.length, cellSize);
  appendHClues(hCluesContainer, hClues, findLongestClueLength(hClues));

  nonogram.appendChild(corner);
  nonogram.appendChild(vCluesContainer);
  nonogram.appendChild(hCluesContainer);
  nonogram.appendChild(field);

  return nonogram;
}

document.addEventListener('DOMContentLoaded', () => {
  const nonogram = buildNonogram(hClues, vClues, 42);
  document.body.appendChild(nonogram);
});
