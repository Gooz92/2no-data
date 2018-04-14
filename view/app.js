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

  for (let i = 0; i < colCount; i++) {
    for (let j = 1; j < rowCount; j++) {
      const cell = createDiv({
        styles: {
          width: innerCellSize,
          height: innerCellSize
        }
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
