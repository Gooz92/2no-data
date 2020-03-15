module.exports = {
  getResult(solution) {
    let filled = 0, empty = 0;

    solution.forEach(cell => {
      if (cell === 1) {
        filled++;
      }
  
      if (cell === 2) {
        empty++;
      }
    });
  
    const solved = filled + empty;
    const unknown = solution.length - solved;
  
    return [ solved, filled, empty, unknown ];
  },
  
  compareResults(resA, resB) {
    return resA.map((numA, index) => resB[index] - numA);
  },

  stringifyResults(results) {
    const resultRows = results.map(result => '  [ ' + result.join(', ') + ' ]');
    return '[\n' + resultRows.join(',\n') + '\n]';
  }
};
