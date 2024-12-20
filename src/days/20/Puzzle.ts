const parseInput = (input: string): { grid: string[][], start: [number, number], end: [number, number] } => {
  const grid = input.trim().split('\n').map(line => line.split(''));
  let start: [number, number] = [-1, -1];
  let end: [number, number] = [-1, -1];

  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c] === 'S') start = [r, c];
      if (grid[r][c] === 'E') end = [r, c];
    }
  }

  return { grid, start, end };
};

const reverseBFS = (grid: string[][], end: [number, number]): number[][] => {
  const rows = grid.length;
  const cols = grid[0].length;
  const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
  const distance = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
  const queue: [number, number][] = [end];
  distance[end[0]][end[1]] = 0;

  while (queue.length > 0) {
    const [r, c] = queue.shift()!;
    for (const [dr, dc] of directions) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] !== '#' && distance[nr][nc] === Infinity) {
        distance[nr][nc] = distance[r][c] + 1;
        queue.push([nr, nc]);
      }
    }
  }

  return distance;
};

const first = (input: string): number => {
  const { grid, start, end } = parseInput(input);
  const distanceToEnd = reverseBFS(grid, end);
  const shortestPathLength = distanceToEnd[start[0]][start[1]];

  const rows = grid.length;
  const cols = grid[0].length;
  const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
  const queue: [number, number, number][] = [[start[0], start[1], 0]];
  const visited = new Set<string>();
  visited.add(`${start[0]},${start[1]}`);

  let timeSavings = 0;

  while (queue.length > 0) {
    const [r, c, steps] = queue.shift()!;

    for (const [dr, dc] of directions) {
      const nr = r + dr;
      const nc = c + dc;

      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] !== '#' && !visited.has(`${nr},${nc}`)) {
        visited.add(`${nr},${nc}`);
        queue.push([nr, nc, steps + 1]);
      }

    }
    timeSavings += exploreCheatPaths(grid, [r, c], distanceToEnd, steps, shortestPathLength, 2);
  }

  return timeSavings;
};

const expectedFirstSolution = '0';

const exploreCheatPaths = (grid: string[][], start: [number, number], distanceToEnd: number[][], stepsSoFar: number, shortestPathLength: number, cheatsAllowed: number): number => {
  const rows = grid.length;
  const cols = grid[0].length;
  const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
  const queue: [number, number, number][] = [[start[0], start[1], 0]];
  const visited = new Set<string>();
  visited.add(`${start[0]},${start[1]}`);

  let timeSavings = 0;

  while (queue.length > 0) {
    const [r, c, cheatSteps] = queue.shift()!;

    if (cheatSteps > 0 && grid[r][c] !== '#') {
      const potentialSaving = shortestPathLength - (stepsSoFar + cheatSteps + distanceToEnd[r][c]);
      if (potentialSaving >= 100) {
        timeSavings++;
      }
    }

    if (cheatSteps < cheatsAllowed) {
      for (const [dr, dc] of directions) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited.has(`${nr},${nc}`)) {
          visited.add(`${nr},${nc}`);
          queue.push([nr, nc, cheatSteps + 1]);
        }
      }
    }
  }

  return timeSavings;
};

const second = (input: string): number => {
  const { grid, start, end } = parseInput(input);
  const distanceToEnd = reverseBFS(grid, end);
  const shortestPathLength = distanceToEnd[start[0]][start[1]];

  const rows = grid.length;
  const cols = grid[0].length;
  const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
  const queue: [number, number, number][] = [[start[0], start[1], 0]];
  const visited = new Set<string>();
  visited.add(`${start[0]},${start[1]}`);

  let totalTimeSavings = 0;

  while (queue.length > 0) {
    const [r, c, steps] = queue.shift()!;

    for (const [dr, dc] of directions) {
      const nr = r + dr;
      const nc = c + dc;

      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] !== '#' && !visited.has(`${nr},${nc}`)) {
        visited.add(`${nr},${nc}`);
        queue.push([nr, nc, steps + 1]);
      }
    }

    // Explore all possible cheat paths from this point
    totalTimeSavings += exploreCheatPaths(grid, [r, c], distanceToEnd, steps, shortestPathLength, 20);
  }

  return totalTimeSavings;
};

const expectedSecondSolution = '0';

export { first, expectedFirstSolution, second, expectedSecondSolution };
