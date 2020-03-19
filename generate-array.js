const identity = value => value;

module.exports = function generateArray(length, generateItem = identity) {
  const array = [];

  for (let i = 0; i < length; i++) {
    array.push(generateItem(i));
  }

  return array;
};
