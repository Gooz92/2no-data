const nono = require('../data/bw/15x15/turtle.json');
const toNibbles = require('./to-nibbles.js');
const fromNibbles = require('./from-nibbles.js');
const { nibbles2r64, r64ToNibbles } = require('../nibbles/nibbles.js');

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'.split('');

const nibbles = toNibbles(nono);

console.log(JSON.stringify([ nono[0], nono[1] ]).length);

const c = [ nono[0], nono[1] ].map(dim => (
  dim.map(line => line.join(',')).join(';')
)).join('/');

console.log(c.length)

console.log(nibbles.length);

const r64data = nibbles2r64(nibbles);
const restoredNibbles = r64ToNibbles(r64data)

console.log(fromNibbles(restoredNibbles));