const first = (input: string) => {
  // Parse the input into a 2D grid
  const grid = input
    .trim()
    .split('\n')
    .map((line) => line.split(''));

  const rows = grid.length;
  const cols = grid[0].length;
  const word = 'XMAS';
  const wordLength = word.length;

  // Define all 8 directions: (dx, dy)
  const directions = [
    [0, 1], // Right
    [0, -1], // Left
    [1, 0], // Down
    [-1, 0], // Up
    [1, 1], // Down-right
    [1, -1], // Down-left
    [-1, 1], // Up-right
    [-1, -1], // Up-left
  ];

  const checkWord = (x: number, y: number, dx: number, dy: number): boolean => {
    for (let k = 0; k < wordLength; k++) {
      const nx = x + k * dx;
      const ny = y + k * dy;
      if (
        nx < 0 ||
        ny < 0 ||
        nx >= rows ||
        ny >= cols ||
        grid[nx][ny] !== word[k]
      ) {
        return false;
      }
    }
    return true;
  };

  let count = 0;

  // Iterate through the grid
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      // Check all 8 directions
      for (const [dx, dy] of directions) {
        if (checkWord(i, j, dx, dy)) {
          count++;
        }
      }
    }
  }

  return count;
};

const expectedFirstSolution = '18';

const second = (input: string) => {
  // Parse the input into a 2D grid
  const grid = input
    .trim()
    .split('\n')
    .map((line) => line.split(''));

  const rows = grid.length;
  const cols = grid[0].length;
  const word = 'MAS';
  const wordLength = word.length;

  const searchDirections = [
    // dx, dy, ss, sdx, sdy
    [1, 1, 2, -1, 1], // Down-right
    [-1, -1, -2, 1, -1], // Up-left
  ];

  const checkWord = (x: number, y: number, dx: number, dy: number): boolean => {
    for (let k = 0; k < wordLength; k++) {
      const nx = x + k * dx;
      const ny = y + k * dy;
      if (
        nx < 0 ||
        ny < 0 ||
        nx >= rows ||
        ny >= cols ||
        grid[nx][ny] !== word[k]
      ) {
        return false;
      }
    }
    return true;
  };

  let count = 0;

  // Iterate through the grid
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      // Search in 2 opposite directions, and check the crossing words
      // This covers all the possibilities without counting twice
      for (const [dx, dy, ss, sdx, sdy] of searchDirections) {
        if (
          checkWord(i, j, dx, dy) &&
          (checkWord(i + ss, j, sdx, sdy) || checkWord(i, j + ss, -sdx, -sdy))
        ) {
          count++;
        }
      }
    }
  }

  return count;
};

const expectedSecondSolution = '9';

export { first, expectedFirstSolution, second, expectedSecondSolution };
