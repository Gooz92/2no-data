const {
  r64ToNibbles,
  nibbles2r64
} = require('./nibbles.js');

const arrEqual = (a, b) => (
  a.every((item, index) => b[index] === item)
);

const TEST_CASES = [
  [
    [ 0 ], [ 0 ]
  ],
  [
    [ 7 ], [ 7 ]
  ],
  [
    [ 15 ], [ 15 ]
  ],
  [
    [ 15, 0 ],
    [ 60, 0, 48 ]
  ],
  [
    [ 15, 1 ],
    [ 60, 16, 48]
  ],
  [
    [ 15, 2 ],
    [ 60, 32, 48]
  ],
  [
    [ 15, 3 ],
    [ 60, 48, 48 ]
  ],
  [
    [ 15, 4 ],
    [ 61, 0, 48 ]
  ],
  [
    [ 15, 5 ],
    [ 61, 16, 48 ]
  ],
  [
    [ 15, 15 ],
    [ 63, 48, 48 ]
  ],
  [
    [ 15, 15, 0 ],
    [ 63, 48 ]
  ],
  [
    [ 15, 15, 1 ],
    [ 63, 49 ]
  ],
  [
    [ 15, 15, 2 ],
    [ 63, 50 ]
  ],
  [
    [ 15, 15, 15 ],
    [ 63, 63 ]
  ],
  [
    [ 15, 15, 15, 0 ],
    [ 63, 63, 0]
  ],
  [
    [ 15, 15, 15, 14 ],
    [ 63, 63, 14 ]
  ],
  [
    [ 15, 15, 15, 15 ],
    [ 63, 63, 15 ]
  ]
];

TEST_CASES.forEach(([ nibbles, r64 ]) => {
  const actualR64 = nibbles2r64(nibbles);
  const actualNibbles = r64ToNibbles(r64);

  console.log(
    actualNibbles.join(',') + ' = ' + nibbles.join(',') + ' : ' + arrEqual(actualNibbles, nibbles)
  );
});

let i = Math.pow(2, 32);

while(i--) {
  const hex = i.toString(16);
  const nibbles = hex.split('').map(n => parseInt(n, 16));
  const r64 = nibbles2r64(nibbles);

  if (!arrEqual(r64ToNibbles(r64), nibbles)) {
    console.log(hex + ' : FAIL');
  }

  if (i % 100000 === 0) console.log(hex);
}