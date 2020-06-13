const { parseString } = require('xml2js');
const { forEachFile } = require('./file.utils.js');
const { readFileSync, writeFileSync } = require('fs');
const solve = require('./solve.js');
const { getResult } = require('./result.utils.js');

function parseClues(rawClues) {
  const clues = [];

  rawClues.forEach(sideClues => {
    const index = sideClues.$.type === 'rows' ? 0 : 1;

    clues[index] = sideClues.line
      .map(({ count }) => (count || [])
      .map(c => +c));
  });

  return clues;
}

forEachFile('./data/xml', path => {
  const data = readFileSync(path);

  console.log(path);

  try {
    parseString(data.toString(), (err, parsed) => {
      if (err) return;
      const puzzle = parsed.puzzleset.puzzle[0];
  
      if (puzzle.color.length === 2) {
        const [ title ]  = puzzle.title;
        const [ description ] = puzzle.description;
        const [ note ] = puzzle.note;
  
        const clues = parseClues(puzzle.clues);

        const dims = clues.map(c => c.length)
  
        if (dims.every(dim => dim > 10 && dim < 15)) {
          const id = path.match(/(\d+)\.xml/)[1];

          const solution = solve(clues[0], clues[1]);
          const result = getResult(solution);

          if (result[3] > 0) {
            const nono = { clues, title, description, note }

            writeFileSync(`./data/webpbn/${id}-${dims.join('x')}.json`, JSON.stringify(nono));
          }
        }
      }
    });
  } catch (e) {
    console.log(e)
  }

});