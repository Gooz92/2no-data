
function numberToNibbles(number) {
  const nibbles = [];

  do {
    nibbles.push(number % 16);
    number = Math.floor(number / 16);
  } while (number > 0);

  nibbles.unshift(nibbles.length);
  
  return nibbles;
}

function array2nibbles(array) {
  const nibbles = numberToNibbles(array.length);

  array.forEach(number => {
    nibbles.push(...numberToNibbles(number));
  });

  return nibbles;
}

module.exports = nono => {
  
  const height = nono[0].length;
  const width = nono[1].length;

  const widthNibbles = numberToNibbles(width);
  const heightNibbles = numberToNibbles(height);

  const nibbles = [
    ...widthNibbles,
    ...heightNibbles
  ];

  nono[0].forEach(lineClues => {
    nibbles.push(...array2nibbles(lineClues));
  });

  nono[1].forEach(lineClues => {
    nibbles.push(...array2nibbles(lineClues));
  });

  return nibbles;
};
