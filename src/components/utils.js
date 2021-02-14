const getPosition = (row, col) => {
  const Xcord = ["a", "b", "c", "d", "e", "f", "g", "h"][col];
  return `${Xcord}${8 - row}`;
};

export { getPosition };
