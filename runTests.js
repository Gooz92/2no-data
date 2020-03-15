const config = require('./tests.js');

const methods = {
  ...require('./solve.utils.js'),
  ...require('./validate.js'),
  ...require('./result.utils.js')
};

Object.keys(config)
  .forEach(methodName => {
    const method = methods[methodName];
    const cases = config[methodName];
    console.log(methodName);
    testMethod(method, cases);
  });

function testMethod(method, cases) {
  cases.forEach(({ args, result }) => {
    const actualResult = method(...args);
    if (!deepEqual(actualResult, result)) {
      throw JSON.stringify(actualResult) + ' no equal to ' + JSON.stringify(result);
    }
  });
}

function deepEqual(obj1, obj2) {
  if (obj1 === obj2) {
    return true;
  }

  if (isArray(obj1) && isArray(obj2)) {
    if (obj1.length !== obj2.length) {
      return false;
    }
    return obj1.every((item, index) => deepEqual(item, obj2[index]));
  } else if (isObject(obj1) && isObject(obj2)) {
    return Object.keys(obj1).every(key => deepEqual(obj1[key], obj2[key]));
  }

  return false;
}

function isArray(arg) {
  return Array.isArray(arg);
}

function isObject(arg) {
  return arg !== null && !isArray(arg) && typeof arg === 'object';
}

