const utils = require('./utils.js');

const defaultMatch = (actual, expected) => utils.deepEqual(actual, expected)

const testUtils = {
  testMethod(method, cases) {
    cases.forEach(({ args, actual, result, match = defaultMatch, stringify = JSON.stringify }) => {
      let actualResult = method(...args);

      if (typeof actual !== 'undefined') {
        actualResult = actual;
      }

      if (!match(actualResult, result)) {
        throw stringify(actualResult) + ' no equal to ' + stringify(result);
      }
    });
  }
};

module.exports = testUtils;
