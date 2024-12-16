type State = { x: number; y: number; dir: Direction; cost: number };

type Direction = 'N' | 'E' | 'S' | 'W';
const directions: Direction[] = ['N', 'E', 'S', 'W'];
const deltas: Record<Direction, [number, number]> = {
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

function dijkstraWithDirections(grid: string[][], start: [number, number]) {
  const rows = grid.length;
  const cols = grid[0].length;

  // Enhanced minCost array
  const minCost = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      N: Infinity,
      E: Infinity,
      S: Infinity,
      W: Infinity,
    }))
  );

  const queue: State[] = [{ x: start[0], y: start[1], dir: 'E', cost: 0 }];

  minCost[start[1]][start[0]]['E'] = 0;

  while (queue.length > 0) {
    queue.sort((a, b) => a.cost - b.cost);
    const { x, y, dir, cost } = queue.shift()!;

    if (cost > minCost[y][x][dir]) {
      continue;
    }

    // Move forward
    const [dx, dy] = deltas[dir];
    const nx = x + dx;
    const ny = y + dy;
    if (
      grid[ny]?.[nx] &&
      grid[ny][nx] !== '#' &&
      cost + 1 < minCost[ny][nx][dir]
    ) {
      minCost[ny][nx][dir] = cost + 1;
      queue.push({ x: nx, y: ny, dir, cost: cost + 1 });
    }

    // Rotate clockwise and counterclockwise
    const currentDirIndex = directions.indexOf(dir);
    const clockwiseDir = directions[(currentDirIndex + 1) % 4];
    const counterclockwiseDir = directions[(currentDirIndex + 3) % 4];

    if (cost + 1000 < minCost[y][x][clockwiseDir]) {
      minCost[y][x][clockwiseDir] = cost + 1000;
      queue.push({ x, y, dir: clockwiseDir, cost: cost + 1000 });
    }

    if (cost + 1000 < minCost[y][x][counterclockwiseDir]) {
      minCost[y][x][counterclockwiseDir] = cost + 1000;
      queue.push({ x, y, dir: counterclockwiseDir, cost: cost + 1000 });
    }
  }

  return minCost;
}

function findBestPathTiles(
  grid: string[][],
  start: [number, number],
  end: [number, number],
  minCost: any[][]
): number {
  const [startX, startY] = start;
  const [endX, endY] = end;
  const rows = grid.length;
  const cols = grid[0].length;

  const bestPathTiles = new Set<string>();

  const minCostToEnd = Math.min(
    minCost[end[1]][end[0]].N,
    minCost[end[1]][end[0]].E,
    minCost[end[1]][end[0]].S,
    minCost[end[1]][end[0]].W
  );

  function dfs(
    x: number,
    y: number,
    dir: Direction,
    cost: number,
    localVisited: Set<string>
  ) {
    if (cost > minCostToEnd) {
      return;
    }
    // Add this tile to the local visited set
    localVisited.add(`${x},${y}`);

    // If we reach the end tile with the exact cost, merge localVisited into bestPathTiles
    if (x === endX && y === endY && cost === minCostToEnd) {
      for (const tile of localVisited) {
        bestPathTiles.add(tile);
      }
      return;
    }

    // Case 1: Forward movement
    const [dx, dy] = deltas[dir];
    const nx = x + dx;
    const ny = y + dy;

    if (
      nx >= 0 &&
      ny >= 0 &&
      nx < cols &&
      ny < rows &&
      grid[ny][nx] !== '#' && // Not a wall
      minCost[ny][nx][dir] === cost + 1 // Valid forward movement cost
    ) {
      dfs(nx, ny, dir, cost + 1, new Set(localVisited));
    }

    // Case 2: Rotation to a different direction
    for (const nextDir of directions) {
      if (
        nextDir !== dir && // Ensure it's a rotation
        minCost[y][x][nextDir] === cost + 1000 // Valid rotation cost
      ) {
        dfs(x, y, nextDir, cost + 1000, new Set(localVisited));
      }
    }
  }
  // Start DFS from the start tile in E direction
  dfs(startX, startY, 'E', 0, new Set());

  return bestPathTiles.size;
}

function first(input: string): number {
  const { grid, start, end } = parseInput(input);
  const minCost = dijkstraWithDirections(grid, start);
  return Math.min(
    minCost[end[1]][end[0]].N,
    minCost[end[1]][end[0]].E,
    minCost[end[1]][end[0]].S,
    minCost[end[1]][end[0]].W
  );
}

const expectedFirstSolution = '7036';

function second(input: string): number {
  const { grid, start, end } = parseInput(input);
  const minCost = dijkstraWithDirections(grid, start);
  return findBestPathTiles(grid, start, end, minCost);
}
const expectedSecondSolution = '64';

export { first, expectedFirstSolution, second, expectedSecondSolution };
