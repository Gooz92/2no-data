const { parseString } = require('xml2js');
const { forEachFile } = require('./file.utils.js');
const { readFileSync, writeFileSync } = require('fs');

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
        const clues = parseClues(puzzle.clues);

        const dims = clues.map(c => c.length)
  
        if (dims.every(dim => [ 12, 14 ].includes(dim))) {
          const id = path.match(/(\d+)\.xml/)[1];
          

          writeFileSync(`./data/webpbn/${id}-${dims.join('x')}.json`, JSON.stringify(clues));
        }
      }
    });
  } catch (e) {
    console.log(e)
  }

});