function isArray(arg) {
  return Array.isArray(arg);
}

function isObject(arg) {
  return arg !== null && !isArray(arg) && typeof arg === 'object';
}

const utils = {
  identity: value => value,

  isObject,

  generateArray(length, generateItem = identity) {
    const array = [];
  
    for (let i = 0; i < length; i++) {
      array.push(generateItem(i));
    }
  
    return array;
  },

  deepEqual(obj1, obj2) {
    if (obj1 === obj2) {
      return true;
    }
  
    if (isArray(obj1) && isArray(obj2)) {
      if (obj1.length !== obj2.length) {
        return false;
      }
      return obj1.every((item, index) => utils.deepEqual(item, obj2[index]));
    } else if (isObject(obj1) && isObject(obj2)) {
      return Object.keys(obj1).every(key => utils.deepEqual(obj1[key], obj2[key]));
    }
  
    return false;
  }  
};

module.exports = utils;
``