const { buildLine } = require('./build-nono.js');
const utils = require('./utils.js');

const tokens = [ '.', '#', 'X' ];

const cases  = [
  {
    id: 'simple boxes #1',
    line: [
      [ 2 ], [ 0, 0, 0 ],
      [ [ [ 2, 0 ] ], [ [ 2, 0 ] ], [ [ 2, 0 ] ] ]
    ],
    result: [ 0, 1, 0 ]
  },
  {
    id: '# 2',
    line: [
      [ 1, 1 ], [ 2, 2, 2, 0, 2, 1, 2, 2 ],
      [ [], [], [], [ [ 1, 0 ], [ 1, 1 ] ], [], [ [ 1, 0 ], [ 1, 1 ] ], [], [] ]
    ],
    result: [ 2, 2, 2, 1, 2, 1, 2, 2 ]
  }
].map(({ line: [ clues, cells, distribution ], result }) => {
  const line = {
    clues,
    distribution,
    cells: cells.map(value => ({ value }))
  }

  return {
    args: [ line ],
    actual: line,
    result,
    match: actual => (
      actual.cells
        .every((cell, index) => cell.value === result[index])
    )
  }
})

module.exports.solveLine = cases;