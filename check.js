const fs = require('fs');

const DATA_FOLDER = './data/bw/5x5';

const files = fs.readdirSync(DATA_FOLDER);

files.forEach(file => {
  const nonogram = require(DATA_FOLDER + file);
  console.log(file + ' ' + (check(nonogram) ? 'v' : 'x'));
});

function check([ hClues, vClues, field ]) {
	const cellsCount = hClues.length * vClues.length;
  
  if (field.length !== cellsCount) {
  	return false;
  }

  for (let i = 0; i < hClues.length; i++) {
    const rowClues = hClues[i];
    let clueIndex = 0;
    let clue = 0;
    for (let j = 0; j < vClues.length; j++) {
     if (field[i * vClues.length + j]) {
       ++clue;
     } else if (clue > 0) {
       if (rowClues[clueIndex] !== clue) {
         return false;
       }
       clue = 0;
       clueIndex++;
     }
    }
  }

  return true;
}
