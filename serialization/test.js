const fileUtils = require('../file.utils.js');
const toNibbles = require('./to-nibbles.js');
const fromNibbles = require('./from-nibbles.js');
const { nibbles2r64 } = require('../nibbles/nibbles.js');

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'.split('');

fileUtils.forEachFile('../data/bw' , file => {
  const nonogram = require(file);
  const clues = [ nonogram[0], nonogram[1] ];
  
  const nibbles = toNibbles(clues);
  const r64 = nibbles2r64(nibbles);
  
  console.log(file, r64.map(n => ALPHABET[n]).join(''), r64.length);
});
