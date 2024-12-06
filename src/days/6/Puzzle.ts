const parseMap = (input: string) => {
  const grid = input
    .trim()
    .split('\n')
    .map((line) => line.split(''));
  let startX = 0,
    startY = 0,
    direction = '^';

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if ('^<>v'.includes(grid[i][j])) {
        startX = i;
        startY = j;
        direction = grid[i][j];
        grid[i][j] = '.'; // Replace the guard's position with an open tile
      }
    }
  }

  return { grid, startX, startY, direction };
};

const directions = ['^', '>', 'v', '<'];
const moves: Record<string, [number, number]> = {
  '^': [-1, 0],
  '>': [0, 1],
  v: [1, 0],
  '<': [0, -1],
};

const simulateGuard = (
  grid: string[][],
  startX: number,
  startY: number,
  direction: string
) => {
  let x = startX;
  let y = startY;
  let currentDir = direction;
  const visited = new Set<string>();
  visited.add(`${x},${y}`);

  const isInside = (nx: number, ny: number) =>
    nx >= 0 && ny >= 0 && nx < grid.length && ny < grid[0].length;

  while (true) {
    const [dx, dy] = moves[currentDir];
    const nx = x + dx;
    const ny = y + dy;

    // Check if the next position is outside the grid
    if (!isInside(nx, ny)) {
      break;
    }

    // Check if the next position is blocked
    if (grid[nx][ny] === '#') {
      // Turn right: update currentDir
      const currentIndex = directions.indexOf(currentDir);
      currentDir = directions[(currentIndex + 1) % 4];
    } else {
      // Move forward
      x = nx;
      y = ny;
      visited.add(`${x},${y}`);
    }
  }

  return visited.size;
};

const first = (input: string) => {
  const { grid, startX, startY, direction } = parseMap(input);
  return simulateGuard(grid, startX, startY, direction);
};

const expectedFirstSolution = '41';

const simulateWithObstruction = (
  grid: string[][],
  startX: number,
  startY: number,
  startDir: string
): number => {
  let obstructionCount = 0;

  const isInside = (nx: number, ny: number) =>
    nx >= 0 && ny >= 0 && nx < grid.length && ny < grid[0].length;

  let x = startX;
  let y = startY;
  let dir = startDir;

  while (true) {
    const [dx, dy] = moves[dir];
    const nx = x + dx;
    const ny = y + dy;

    // Stop if out of bounds
    if (!isInside(nx, ny)) {
      break;
    }

    // If there's no obstacle ahead, try placing one
    if (grid[nx][ny] === '.') {
      // Simulate the guard's movement with this obstruction
      const tempGrid = grid.map((row) => [...row]); // Clone the grid
      tempGrid[nx][ny] = '#';
      let tempX = x,
        tempY = y,
        tempDir = dir;

      while (true) {
        // Detect loop if current position already has the same direction
        if (tempGrid[tempX][tempY] === tempDir) {
          obstructionCount++;
          break;
        }

        const [tdx, tdy] = moves[tempDir];
        const nextX = tempX + tdx;
        const nextY = tempY + tdy;

        if (!isInside(nextX, nextY)) {
          break;
        } // Stop if out of bounds

        if (tempGrid[nextX][nextY] === '#') {
          // Turn right
          const currentIndex = directions.indexOf(tempDir);
          tempDir = directions[(currentIndex + 1) % 4];
        } else {
          // Mark position and move forward
          tempGrid[tempX][tempY] = tempDir;
          tempX = nextX;
          tempY = nextY;
        }
      }
    }

    // If there's an obstacle ahead, turn right
    if (grid[nx][ny] === '#') {
      const currentIndex = directions.indexOf(dir);
      dir = directions[(currentIndex + 1) % 4];
    } else {
      // Mark position and move forward
      grid[x][y] = dir;
      x = nx;
      y = ny;
    }
  }

  return obstructionCount;
};

const second = (input: string) => {
  const { grid, startX, startY, direction } = parseMap(input);
  return simulateWithObstruction(grid, startX, startY, direction);
};

const expectedSecondSolution = '6';

export { first, expectedFirstSolution, second, expectedSecondSolution };
