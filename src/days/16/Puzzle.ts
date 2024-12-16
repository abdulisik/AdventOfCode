type State = { x: number; y: number; dir: string; cost: number };

const directions = ['E', 'S', 'W', 'N'];
const deltas: Record<string, [number, number]> = {
  E: [1, 0],
  S: [0, 1],
  W: [-1, 0],
  N: [0, -1],
};

function parseInput(input: string) {
  const grid = input.split('\n').map((line) => line.split(''));
  let start: [number, number] = [0, 0];
  let end: [number, number] = [0, 0];

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (grid[y][x] === 'S') {
        start = [x, y];
      }
      if (grid[y][x] === 'E') {
        end = [x, y];
      }
    }
  }

  return { grid, start, end };
}

function dijkstra(
  grid: string[][],
  start: [number, number],
  end: [number, number]
) {
  const [endX, endY] = end;

  // Min-Heap Priority Queue for Dijkstra
  const queue: State[] = [{ x: start[0], y: start[1], dir: 'E', cost: 0 }];
  const visited = new Set<string>();

  const encodeState = (x: number, y: number, dir: string) => `${x},${y},${dir}`;

  while (queue.length > 0) {
    // Sort queue to prioritize the smallest cost
    queue.sort((a, b) => a.cost - b.cost);
    const { x, y, dir, cost } = queue.shift()!;

    // If we reach the end, return the cost
    if (x === endX && y === endY) {
      return cost;
    }

    // Mark current state as visited
    const stateKey = encodeState(x, y, dir);
    if (visited.has(stateKey)) {
      continue;
    }
    visited.add(stateKey);

    // Try moving forward
    const [dx, dy] = deltas[dir];
    const nx = x + dx;
    const ny = y + dy;
    if (grid[ny]?.[nx] && grid[ny][nx] !== '#') {
      queue.push({ x: nx, y: ny, dir, cost: cost + 1 });
    }

    // Try rotating clockwise and counterclockwise
    const currentDirIndex = directions.indexOf(dir);
    const clockwiseDir = directions[(currentDirIndex + 1) % 4];
    const counterclockwiseDir = directions[(currentDirIndex + 3) % 4];

    queue.push({ x, y, dir: clockwiseDir, cost: cost + 1000 });
    queue.push({ x, y, dir: counterclockwiseDir, cost: cost + 1000 });
  }

  return Infinity; // If no path is found
}

function first(input: string): number {
  const { grid, start, end } = parseInput(input);
  return dijkstra(grid, start, end);
}

const expectedFirstSolution = '7036';

const second = (input: string) => {
  return 'solution 2';
};

const expectedSecondSolution = 'solution 2';

export { first, expectedFirstSolution, second, expectedSecondSolution };
