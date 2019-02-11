const fileUtils = require('../file.utils.js');
const toNibbles = require('./to-nibbles.js');
const fromNibbles = require('./from-nibbles.js');
const { nibbles2r64, r64ToNibbles} = require('../nibbles/nibbles.js');

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'.split('');

fileUtils.forEachFile('../data/webpbn' , file => {
  const nonogram = require(file);
  const clues = [ nonogram[0], nonogram[1] ];
  
  const nibbles = toNibbles(clues);
  const r64 = nibbles2r64(nibbles);
  
  console.log(JSON.stringify(fromNibbles(r64ToNibbles(r64))) === JSON.stringify(clues), r64.length);
});
