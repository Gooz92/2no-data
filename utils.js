function roundColor(colorCode) {
  const channels = [
    colorCode.substring(0, 2),
    colorCode.substring(2, 4),
    colorCode.substring(4, 6)
  ];

  return channels 
    .map(channel => (
      Math.round(parseInt(channel, 16) / 17)
      .toString(16)
    )).join('');
}

const stringifyBwClues = clues => (
  clues
    .map(sideClues => (
      sideClues
        .map(lineClues => lineClues.map(clue => clue.toString(32)).join(','))
        .join(';')
    ))
    .join('/')
);

const stringifyColorClues = clues => (
  clues
    .map(sideClues => (
      sideClues
        .map(lineClues => (
          lineClues.map(([ blockLength, colorIndex ]) => blockLength + ':' + colorIndex)
        )).join(';')
    ))
    .join('/')
);

const parseBwClues = clues => (
  clues.split('/')
    .map(sideClues =>
      sideClues.split(';')
        .map(lineClues =>
          lineClues.split(',')
            .map(clue => parseInt(clue, 32))
        )
    )
);

const parseColorClues = clues => (
  clues.split('/')
    .map(sideClues =>
      sideClues.split(';')
        .map(lineClues =>
          lineClues.split(',')
            .map(clue => clue.split(':').map(n => +n))
        )
    )
);


module.exports = { stringifyBwClues, parseBwClues };
