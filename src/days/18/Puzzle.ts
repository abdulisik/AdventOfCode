const directions = [
  [0, 1], [1, 0], [0, -1], [-1, 0] // Right, Down, Left, Up
];
const gridSize = 71;
const first = (input: string) => {
  const maxBytes = 1024; // First kilobyte

  // Parse input into a list of coordinates
  const bytePositions = input.split('\n').map(line => line.split(',').map(Number));

  // Initialize grid
  const grid = Array.from({ length: gridSize }, () => Array(gridSize).fill('.'));

  // Simulate falling bytes
  for (let i = 0; i < Math.min(maxBytes, bytePositions.length); i++) {
    const [x, y] = bytePositions[i];
    grid[y][x] = '#'; // Mark as corrupted
  }

  return bfs(grid);
};

const expectedFirstSolution = '146'; // 22 for the example input, if you set gridSize = 7 and maxBytes = 12

const bfs = (grid: any[][]) => {
  // BFS to find shortest path
  const queue: [number, number, number][] = [[0, 0, 0]]; // [x, y, steps]
  const visited = new Set<string>();
  visited.add('0,0');

  while (queue.length > 0) {
    const [x, y, steps] = queue.shift()!;
    if (x === gridSize - 1 && y === gridSize - 1) {
      return steps; // Reached the exit
    }

    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < gridSize && ny >= 0 && ny < gridSize && grid[ny][nx] === '.' && !visited.has(`${nx},${ny}`)) {
        queue.push([nx, ny, steps + 1]);
        visited.add(`${nx},${ny}`);
      }
    }
  }

  return -1; // No path found
}

const second = (input: string) => {

  // Parse input into a list of coordinates
  const bytePositions = input.split('\n').map(line => line.split(',').map(Number));

  // Initialize grid
  const grid = Array.from({ length: gridSize }, () => Array(gridSize).fill('.'));

  // Simulate falling bytes and check path existence
  for (let i = 0; i < bytePositions.length; i++) {
    const [x, y] = bytePositions[i];
    grid[y][x] = '#'; // Mark as corrupted

    if (bfs(grid) === -1) {
      return `${x},${y}`; // Return the first blocking byte
    }
  }

  return 'No blocking byte found'; // In case all bytes are processed without blocking
};

const expectedSecondSolution = 'No blocking byte found'; // 6,1 for the example input, if you set gridSize = 7

export { first, expectedFirstSolution, second, expectedSecondSolution };