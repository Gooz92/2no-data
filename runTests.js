const config = require('./tests.js'),
  testUtils = require('./test.utils.js')

const methods = {
  ...require('./solve.utils.js'),
  ...require('./validate.js'),
  ...require('./result.utils.js'),
  solveLine: require('./solve-line.js')
};

Object.keys(config)
  .forEach(methodName => {
    const method = methods[methodName];
    const cases = config[methodName];
    console.log(methodName);
    testUtils.testMethod(method, cases);
  });