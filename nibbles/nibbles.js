 // 15 < MAGIC_NUMBER < 64

const MAGIC_NUMBER = 48;

function nibblesTrio2Letters(one, two, three) {
  return [
    one << 2 | two >> 2,
    two << 4 & 48 | three
  ];
}

function lettersPairToNibbles(first, second) {
  return [
    first >> 2,
    first << 2 & 12 | second >> 4,
    second & 15
  ];
}

function nibbles2r64(nibbles) {
  var tail = nibbles.length % 3, r64 = [], i;

  for (i = 0; i < nibbles.length - tail; i += 3) {
    r64 = r64.concat(nibblesTrio2Letters(nibbles[i], nibbles[i + 1], nibbles[i + 2]));
  }

  if (tail === 1) {
    r64.push(nibbles[nibbles.length - 1]);
  }

  if (tail == 2) {
    r64.push(nibbles[nibbles.length - 2] << 2 | nibbles[nibbles.length - 1] >> 2, nibbles[nibbles.length - 1] << 4 & 48, MAGIC_NUMBER);
  }

  return r64;
}

function r64ToNibbles(r64) {
  var nibbles = [], tail = r64.length % 2, i;

  for (i = 0; i < r64.length - tail; i += 2) {
    nibbles = nibbles.concat(lettersPairToNibbles(r64[i], r64[i + 1]));
  }

  if (tail === 1) {
    if (r64[r64.length - 1] < 16) nibbles.push(r64[r64.length - 1]);
    else nibbles.pop();
  }

  return nibbles;
}

module.exports = {
  r64ToNibbles,
  nibbles2r64,
  MAGIC_NUMBER
};