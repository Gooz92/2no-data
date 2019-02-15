const px = value => `${value}px`;

const valueFn = value => value;

const cssValueConverters = {
  width: px,
  height: px
};

export function createElement(tagName, options = {}) {
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

export const createDiv = options => createElement('div', options);