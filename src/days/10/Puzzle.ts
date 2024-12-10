const parseMap = (input: string): number[][] =>
  input
    .trim()
    .split('\n')
    .map((line) => line.split('').map(Number));

const directions = [
  [-1, 0], // Up
  [1, 0], // Down
  [0, -1], // Left
  [0, 1], // Right
];

const bfsTrailScore = (
  grid: number[][],
  startX: number,
  startY: number
): number => {
  const rows = grid.length;
  const cols = grid[0].length;
  const queue: [number, number][] = [[startX, startY]];
  const reachableNines = new Set<string>();

  while (queue.length > 0) {
    const [x, y] = queue.shift()!;
    const currentHeight = grid[x][y];

    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;

      if (nx >= 0 && ny >= 0 && nx < rows && ny < cols) {
        const nextHeight = grid[nx][ny];

        if (nextHeight === currentHeight + 1) {
          if (nextHeight === 9) {
            reachableNines.add(`${nx},${ny}`);
          } else {
            queue.push([nx, ny]);
          }
        }
      }
    }
  }

  return reachableNines.size;
};

const first = (input: string) => {
  const grid = parseMap(input);
  let totalScore = 0;

  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[0].length; y++) {
      if (grid[x][y] === 0) {
        totalScore += bfsTrailScore(grid, x, y);
      }
    }
  }

  return totalScore;
};

const expectedFirstSolution = '36';

const second = (input: string): number => {
  const grid = parseMap(input);
  const rows = grid.length;
  const cols = grid[0].length;

  // Initialize scores and processing queue
  const scores = Array.from({ length: rows }, () => Array(cols).fill(0));
  const queue: [number, number][] = [];
  const seen = new Set<string>();

  // Enqueue all '9' positions
  for (let x = 0; x < rows; x++) {
    for (let y = 0; y < cols; y++) {
      if (grid[x][y] === 9) {
        queue.push([x, y]);
        seen.add(`${x},${y}`); // Add to the set
        scores[x][y] = 1; // Initialize score for 9's
      }
    }
  }

  let totalScore = 0;

  // BFS-like processing with single traversal
  while (queue.length > 0) {
    const [x, y] = queue.shift()!;
    const value = scores[x][y];

    // Add to total score if it's a trailhead
    if (grid[x][y] === 0) {
      totalScore += value;
      continue;
    }

    // Process neighbors
    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;

      if (nx >= 0 && ny >= 0 && nx < rows && ny < cols) {
        if (grid[nx][ny] === grid[x][y] - 1) {
          scores[nx][ny] += value; // Accumulate scores from the current position

          // Enqueue if not already seen
          const key = `${nx},${ny}`;
          if (!seen.has(key)) {
            queue.push([nx, ny]);
            seen.add(key);
          }
        }
      }
    }
  }

  return totalScore;
};

const expectedSecondSolution = '81';

export { first, expectedFirstSolution, second, expectedSecondSolution };
