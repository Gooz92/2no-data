module.exports = {

  isLineValid(clues, line) {
    let clueIndex = 0;
    let currentClue = clues[clueIndex];
    let blockLength = 0;

    for (let i = 0; i < line.length; i++) {
      if (line[i] === 1) {
        blockLength++;
      } else if (blockLength > 0) {
        if (currentClue !== blockLength) {
          return false;
        }
        currentClue = clues[clueIndex];
        blockLength = 0;
      }
    }

    if (currentClue !== blockLength) {
      return false;
    }
  
    return true;
  },

  isValid(nonogram) {
    const [ horizontalClues, verticalClues,  field ] = nonogram;
    
  }
};
