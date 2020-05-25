const { buildLine } = require('./build-nono.js');
const utils = require('./utils.js');

const cases  = [
  {
    id: 'simple boxes #1',
    line: [ [ 2 ], [ 0, 0, 0 ] ],
    result: [ 0, 1, 0 ]
  },
  {
    id: 'simple boxes #2',
    line: [ [ 2, 1, 3 ], utils.generateArray(10, () => 0)],
    result: [ 0, 0, 0, 0, 0, 0, 0, 1, 0, 0 ]
  },
  {
    id: 'glue',
    line: [ [ 4 ], [ 0, 1, 0, 0, 0, 0, 0, 0 ] ],
    result: [ 0, 1, 1, 1, 0, 2, 2, 2 ]
  },
  {
    id: 'fill hole',
    line: [ [ 3 ], [ 0, 0, 0, 2, 0, 2, 0, 0, 0 ] ],
    result: [ 0, 0, 0, 2, 2, 2, 0, 0, 0 ]
  }
].map(({ line: [ clues, cells ], result }) => {
  const line = buildLine(clues, cells.length, 0, 0)
  line.cells = cells.map(value => ({ value }));

  return {
    args: [ line ],
    actual: line,
    match: actual => (
      actual.cells
        .every((cell, index) => cell.value === result[index])
    )
  }
})

module.exports.solveLine = cases;