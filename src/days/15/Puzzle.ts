type Position = { x: number; y: number };

const parseInput = (
  input: string
): { map: string[][]; moves: string[]; robot: Position } => {
  const [mapData, moveData] = input.split('\n\n');
  const map = mapData.split('\n').map((line) => line.split(''));
  const moves = moveData.replace(/\n/g, '').split('');

  let robot: Position = { x: 0, y: 0 };
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      if (map[y][x] === '@') {
        robot = { x, y };
      }
    }
  }

  return { map, moves, robot };
};

const directions: Record<string, Position> = {
  '^': { x: 0, y: -1 },
  v: { x: 0, y: 1 },
  '<': { x: -1, y: 0 },
  '>': { x: 1, y: 0 },
};

const first = (input: string): number => {
  const { map, moves, robot } = parseInput(input);
  let robotPos = { ...robot };

  const isWall = (x: number, y: number) => map[y][x] === '#';

  for (const move of moves) {
    const dir = directions[move];
    const next = { x: robotPos.x + dir.x, y: robotPos.y + dir.y };

    // Check if robot can move
    if (isWall(next.x, next.y)) {
      continue;
    }

    if (map[next.y][next.x] === 'O') {
      // Find the end of the chain of boxes
      let endPos = { ...next };
      while (map[endPos.y][endPos.x] === 'O') {
        endPos = { x: endPos.x + dir.x, y: endPos.y + dir.y };
      }

      // If the end position is invalid, cancel the move
      if (isWall(endPos.x, endPos.y) || map[endPos.y][endPos.x] !== '.') {
        continue;
      }

      // Teleport the first box to the end of the chain
      map[next.y][next.x] = '.';
      map[endPos.y][endPos.x] = 'O';
    }

    // Move robot
    map[robotPos.y][robotPos.x] = '.';
    robotPos = next;
    map[robotPos.y][robotPos.x] = '@';
  }

  // Calculate GPS coordinates of all boxes
  let gpsSum = 0;
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      if (map[y][x] === 'O') {
        gpsSum += y * 100 + x;
      }
    }
  }

  return gpsSum;
};

const expectedFirstSolution = '2028';

const second = (input: string) => {
  return 'solution 2';
};

const expectedSecondSolution = 'solution 2';

export { first, expectedFirstSolution, second, expectedSecondSolution };
