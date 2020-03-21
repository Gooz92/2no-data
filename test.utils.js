const utils = require('./utils.js');

const testUtils = {
  testMethod(method, cases) {
    cases.forEach(({ args, result }) => {
      const actualResult = method(...args);
      if (!utils.deepEqual(actualResult, result)) {
        throw JSON.stringify(actualResult) + ' no equal to ' + JSON.stringify(result);
      }
    });
  }
};

module.exports = testUtils;
