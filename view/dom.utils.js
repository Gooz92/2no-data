export function createElement(tagName, options = {}) {
  const element = document.createElement(tagName);

  const properties = Object.keys(options)
    .filter(key => key !== 'styles')
    .reduce((props, key) => ({
      ...props,
      [key]: options[key]
    }), {});
  
  Object.assign(element, properties);

  Object.assign(element.style, options.styles || {});

  return element;
}

export const createDiv = options => createElement('div', options);

export const createContainer = (className, width, height) => (
  createDiv({
    className,
    styles: {
      width: `${width}px`,
      height: `${height}px`
    }
  })
);
