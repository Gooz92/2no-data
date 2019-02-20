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

forEachFile('./data/webpbn', path => {
  const data = readFileSync(path);
  parseString(data.toString(), (err, parsed) => {
    const puzzle = parsed.puzzleset.puzzle[0];

    if (puzzle.color.length === 2) {
      const clues = parseClues(puzzle.clues);
      const id = path.match(/\d+/)[0];

      writeFileSync(`./data/webpbn/${id}.json`, JSON.stringify(clues));
    }
  });
});