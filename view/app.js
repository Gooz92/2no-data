function createElement(tagName, options = {}) {
  const element = document.createElement(tagName);

  const properties = Object.keys(options)
    .filter(key => key !== 'styles')
    .reduce((props, key) => ({ ...props, [ key ]: options[key] }), {});
  
  Object.assign(element, properties);

  const styles = options.styles || {};

  Object.assign(element.style, styles);

  return element;
}

const createDiv = options => createElement('div', options);

function buildField(colCount, rowCount, cellSize) {
  const width = `${colCount * cellSize}px`;
  const height = `${rowCount * cellSize}px`;

  const innerCellSize = `${cellSize - 1}px`;

  const field = createDiv({
    className: 'field',
    styles: {
      width, height
    }
  });

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
          width: `${cellSize - (isLastCol ? 0 : 1)}px`,
          height: `${cellSize - (isLastRow ? 0 : 1)}px`
        },
        className: classes.join(' ')
      });
  
      field.appendChild(cell);
    }
  }
  
  return field;
}

document.addEventListener('DOMContentLoaded', () => {
  const field = buildField(20, 15, 20);

  document.body.appendChild(field);
});
