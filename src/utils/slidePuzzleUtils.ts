
export const shuffleTiles = (array: number[]): number[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  if (!isSolvable(shuffled)) {
    if (shuffled[0] !== 0 && shuffled[1] !== 0) {
      [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
    } else if (shuffled[2] !== 0 && shuffled[3] !== 0) {
      [shuffled[2], shuffled[3]] = [shuffled[3], shuffled[2]];
    }
  }
  
  return shuffled;
};

export const isSolvable = (puzzle: number[]): boolean => {
  let inversions = 0;
  const filtered = puzzle.filter(tile => tile !== 0);
  
  for (let i = 0; i < filtered.length - 1; i++) {
    for (let j = i + 1; j < filtered.length; j++) {
      if (filtered[i] > filtered[j]) {
        inversions++;
      }
    }
  }
  
  return inversions % 2 === 0;
};

export const checkWin = (tiles: number[]): boolean => {
  if (tiles.length === 0) return false;
  
  return tiles.every((tile, index) => {
    if (index === tiles.length - 1) return tile === 0;
    return tile === index + 1;
  });
};

export const canMoveTile = (index: number, emptyIndex: number, size: number): boolean => {
  const row = Math.floor(index / size);
  const col = index % size;
  const emptyRow = Math.floor(emptyIndex / size);
  const emptyCol = emptyIndex % size;

  return (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
         (Math.abs(col - emptyCol) === 1 && row === emptyRow);
};
