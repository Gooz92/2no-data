const utils = require('./utils.js');

const defaultMatch = (actual, expected) => utils.deepEqual(actual, expected)

const testUtils = {
  testMethod(method, cases) {
    cases.forEach(({ args, actual, result, match = defaultMatch }) => {
      let actualResult = method(...args);
      
      if (typeof actual !== 'undefined') {
        actualResult = actual;
      }

      if (!match(actualResult, result)) {
        throw JSON.stringify(actualResult) + ' no equal to ' + JSON.stringify(result);
      }
    });
  }
};

module.exports = testUtils;
