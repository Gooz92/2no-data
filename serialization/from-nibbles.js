const Reader = require('./Reader.js');

module.exports = nibbles => {
  const reader = new Reader(nibbles);

  let width = reader.nextNumber(),
    height = reader.nextNumber();
  
  const clues = [[], []];

  while (height-- > 0)  clues[0].push(reader.nextArray());

  while (width-- > 0)  clues[1].push(reader.nextArray());

  return clues;
};