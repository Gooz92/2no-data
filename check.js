const fs = require('fs');

const DATA_FOLDER = './data/';

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

  return true;
}
