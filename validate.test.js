module.exports = {
  isLineValid: [
    {
      args: [ [ 1, 2 ], [ 1, 0, 1, 1 ] ],
      result: true
    },
    {
      args: [ [], [ 0, 0, 0 ] ],
      result: true
    },
    {
      args: [ [ 1 ], [ 0, 0, 1 ] ],
      result: true
    },
    {
      args: [ [ 3 ], [ 1, 1, 1 ] ],
      result: true
    },
    {
      args: [ [ 2 ], [ 0, 1, 1, 1 ] ],
      result: false
    }
  ]
};
