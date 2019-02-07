const [ hClues, vClues ] = require('../data/bw/house-7x7.json');

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

function appendCells(field, colCount, rowCount, cellSize) {

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
        className: classes.join(' ')
      });
  
      field.appendChild(cell);
    }
  }
}

const findLongestClueLength = clues => (
  Math.max(...clues.map(clue => clue.length))
);

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

  appendCells(field, vClues.length, hClues.length, cellSize);

  nonogram.appendChild(corner);
  nonogram.appendChild(vCluesContainer);
  nonogram.appendChild(hCluesContainer);
  nonogram.appendChild(field);

  return nonogram;
}

document.addEventListener('DOMContentLoaded', () => {
  const nonogram = buildNonogram(hClues, vClues, 20);
  document.body.appendChild(nonogram);
});
