class Reader {
  
  constructor(nibbles) {
    this.nibbles = nibbles;
    this.position = 0;
  }

  nextNumber() {
    const nibblesCount = nibbles[this.position];

    let number = 0, index = 0;

    while (index++ < nibblesCount) {
      number += nibbles[this.position + index] * Math.pow(16, index - 1);
    }

    this.position += nibblesCount + 1;

    return number;
  }

  nextArray() {
    let arrayLength = this.nextNumber();
    const array = [];

    while(arrayLength--) {
      array.push(this.nextNumber());
    }

    return array;
  }
}

module.exports = Reader;