const { generateLineClues } = require('./solve.js');

const length = 26;

const clues = [ [] ];

for (let i = 1; i < length; i++) {
  console.time('length: ' + i);
  clues.push(...generateLineClues(i));
  console.timeEnd('length: ' + i);
  console.log('clues: ' + clues.length + '\n');
}
