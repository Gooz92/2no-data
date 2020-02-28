module.exports = {

  isLineValid(clues, line) {
    let clueIndex = 0;
    let currentClue = clues[clueIndex] || 0;
    let blockLength = 0;

    for (let i = 0; i < line.length; i++) {
      if (line[i] === 1) {
        blockLength++;
      } else if (blockLength > 0) {
        if (currentClue !== blockLength) {
          return false;
        }
        currentClue = clues[++clueIndex];
        blockLength = 0;
      }
    }

    if (currentClue !== blockLength) {
      return false;
    }
  
    return true;
  },

  /*
   * solution[cell] = { 0, 1, 2 }; 
   * 0 - unknown, 1 - filled, 2 - empty
   * 
   * solved[cell] = { 0, 1 }
   * 0 - empty, 1 - filled
   *
   */

  isValid(solution, solved) {
    return solution.every((cell, index ) => cell === 0 || [ 1, 0 ][cell - 1] === solved[index]);
  }
};
