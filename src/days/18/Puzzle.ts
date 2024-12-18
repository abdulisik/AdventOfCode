const first = (input: string) => {
  const gridSize = 71; // Example grid size (0 to 6)
  const maxBytes = 1024; // First kilobyte
  const directions = [
    [0, 1], [1, 0], [0, -1], [-1, 0] // Right, Down, Left, Up
  ];

  // Parse input into a list of coordinates
  const bytePositions = input.split('\n').map(line => line.split(',').map(Number));

  // Initialize grid
  const grid = Array.from({ length: gridSize }, () => Array(gridSize).fill('.'));

  // Simulate falling bytes
  for (let i = 0; i < Math.min(maxBytes, bytePositions.length); i++) {
    const [x, y] = bytePositions[i];
    grid[y][x] = '#'; // Mark as corrupted
  }

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
};

const expectedFirstSolution = '146'; // 22 for the example input, if you set gridSize = 7 and maxBytes = 12

const second = (input: string) => {
  return 'solution 2';
};

const expectedSecondSolution = 'solution 2';

export { first, expectedFirstSolution, second, expectedSecondSolution };