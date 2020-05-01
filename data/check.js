const fileUtils = require('../file.utils.js');

const DATA_FOLDER = './bw/';

fileUtils.forEachFile(DATA_FOLDER , file => {
  const nonogram = require(file);

  console.log(file + ' ' + (check(nonogram) ? 'v' : 'x'));
});

function checkSideClues(clues, oppositeSideLength, get) {

  for (let i = 0; i < clues.length; i++) {
    const lineClues = clues[i];
    let clueIndex = 0;
    let clue = 0;
    for (let j = 0; j < oppositeSideLength; j++) {
      if (get(i, j)) {
        ++clue;
      } else if (clue > 0) {
        if (lineClues[clueIndex] !== clue) {
          return false;
        }
        clue = 0;
        clueIndex++;
      }
    }

    if (clue > 0 && lineClues[clueIndex] !== clue) {
      return false;
    }
  }

  return true;
}

function check([ hClues, vClues, field ]) {

  return (checkSideClues(hClues, vClues.length, (i, j) => field[i * vClues.length + j]) &&
    checkSideClues(vClues, hClues.length, (i, j) => field[j * vClues.length + i]))
}
