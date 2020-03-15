module.exports = {
  calculateBounds: [
    {
      args: [ [ 10 ], 10 ],
      result: [
        [ 0, 9 ]
      ]
    },
    /*
     *
     * 
     * 2 2 | # # . # # . |
     *     | . # # . # # |
     *       0 0 0 1 1 1
     *
     */
    {
      args: [ [ 2, 2 ], 6 ],
      result: [
        [ 0, 2 ],
        [ 3, 5 ]
      ]
    },
    {
      args: [ [ 2, 2 ], 7 ],
      result: [
        [ 0, 3 ],
        [ 3, 6 ]
      ]
    },
    {
      args: [ [ 1, 1 ], 7 ],
      result: [
        [ 0, 4 ],
        [ 2, 6 ]
      ]
    },

    /*
     *         0 1 2 3 4 5 6 7 8 9
     * 1 1 1 | # . # . # . . . . . |
     *       | . . . . . # . # . # |
     */

     {
        args: [ [ 1, 1, 1 ], 10 ],
        result: [
          [ 0, 5 ],
          [ 2, 7 ],
          [ 4, 9 ]
        ]
     }
  ],

  simpleBlock: [
    {
      args: [ 2, [ 0, 2 ] ],
      result: [ 1 ]
    }
  ],

  cluesIndexesMask: [
    {
      args: [ [ [ 0, 2 ] ] ],
      result: [ [ 0 ], [ 0 ], [ 0 ] ]
    },

    /*
     * 
     *       0 1 2 3 4
     * 1 1 | # . # . . |
     *     | . . # . # |
     *       0 0 0
     *           1 1 1
     */
    {
      args: [ [ [ 0, 2 ], [ 2, 4 ] ] ],
      result: [ [ 0 ], [ 0 ], [ 0, 1 ], [ 1 ], [ 1 ] ]
    }
  ],

  getFilledBlocks: [
    {
      args: [ [ 1, 1 ], [ 0, 1, 0 ] ],
      result: [ [ 1, 1 ] ]
    },
    {
      args: [ [ 0, 2 ], [ 0, 1, 0 ] ],
      result: [ [ 1, 1 ] ]
    },
    {
      args: [ [ 0, 3 ], [ 1, 1, 0, 0 ] ],
      result: [ [ 0, 1 ] ]
    },
    {
      args: [ [ 0, 3 ], [ 0, 0, 0, 1 ] ],
      result: [ [ 3, 3 ] ]
    },
    {
      args: [ [ 0, 3 ], [ 1, 1, 0, 1 ] ],
      result: [ [ 0, 1 ], [ 3, 3 ] ]
    },
    {
      args: [ [ 1, 7 ], [ 0, 1, 1, 0, 1, 0, 1, 1, 0 ] ],
      result: [ [ 1, 2 ], [ 4, 4 ], [ 6, 7 ] ]
    }
  ],

  getAbsoluteIndexes: [
    {
      args: [ 1, 0, [ 1, 2 ] ],
      result: [ [ 1, 1 ], [ 1, 2 ] ]
    },
    {
      args: [ 2, 1, [ 2, 4 ] ],
      result: [ [ 2, 2 ], [ 4, 2 ] ]
    }
  ],

  findEmptyCells: [
    /* 
     *       0 1 2 3 4 5 6 7
     * 1 2 | . . . # . . . . |
     *       0 0 0 0 0
     *           1 1 1 1 1 1
     *
     * 
     *       0 1 2 3 4 5 6 7
     * 1 2 | . . . . . # . . |
     *     | . . . . . # . x |
     *       0 0 0 0 0
     *           1 1 1 1 1 1
     */

     /**
      *     0 1 2 3
      * 2 | . # # . |
      *   | x # # x |
      *     0 0 0 0
      */

     {
       args: [ [ 2 ], [ 1, 2 ], [ [0], [0], [0], [0] ] ],
       result: [ 0, 3 ]
     },

     /**
      * 1 3 | # . # # # |
      *       0 1 2 3 4
      */

     {
      args: [ [ 1, 3 ], [0,0], [[0], [], [1], [1], [1]]],
      result: [1]
     },

     /**
      * 
      * 1 3 | # . # # # . |
      *     | . # . # # # |
      *       0 0 1 1 1 1
      * 
      *     | . . # # # . |
      *     | . x # # # x |
      *       0 1 2 3 4 5
      */

    {
      args: [ [ 1, 3 ], [ 2, 4 ],[ [0], [0], [1], [1], [1], [1]]],
      result: [ 1, 5 ]
    },

     /**
      * 
      * 1 3 | # . # # # . . |
      *     | . . # . # # # |
      *       0 0 0 
      *           1 1 1 1 1 
      * 
      * 1 3 | . . # # # . . |
      *     | . x # # # x x |
      *     | 0 1 2 3 4 5 6 |
      */

      {
        args: [ [ 1, 3 ], [ 2, 4 ], [ [0], [0], [0,1], [1], [1], [1], [1] ] ],
        result: [ 1, 5, 6 ]
      }
  ],

  generateLineClues: [
    {
      args: [ 1 ],
      result: [ [ 1 ] ]
    },
    {
      args: [ 2 ],
      result: [ [ 2 ] ]
    },
    {
      args: [ 3 ],
      result: [ [ 3 ], [ 1, 1 ] ]
    },
    {
      args: [ 4 ],
      result: [ [ 4 ], [ 1, 2 ], [ 2, 1 ]]
    },
    {
      args: [ 5 ],
      result: [ [ 5 ], [ 1, 3 ], [ 2, 2 ], [ 3, 1 ], [ 1, 1, 1 ] ]
    },
    {
      args: [ 6 ],
      result: [ [ 6 ], [ 1, 4 ], [ 2, 3 ], [ 3, 2 ], [ 4, 1 ], [ 1, 1, 2  ], [ 1, 2, 1 ], [ 2, 1, 1 ] ]
    },
    {
      args: [ 7 ],
      result: [
        [ 7 ],
        [ 1, 5 ], [ 2, 4 ], [ 3, 3 ], [ 4, 2 ], [ 5, 1 ],
        [ 1, 1, 3 ], [ 1, 2, 2 ], [ 1, 3, 1 ],
        [ 2, 1, 2 ], [ 2, 2, 1 ],
        [ 3, 1, 1 ],

        [ 1, 1, 1, 1 ]
      ]
    }
  ]
};