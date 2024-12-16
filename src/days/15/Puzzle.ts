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

  return calculateGPS(map);
};

const expectedFirstSolution = '2028';

const parseScaledInput = (
  input: string
): { map: string[][]; moves: string[]; robot: Position } => {
  const { map, moves, robot } = parseInput(input);
  const scaledMap: string[][] = [];
  for (const row of map) {
    const newRow: string[] = [];

    for (const tile of row) {
      if (tile === '#') {
        newRow.push('#', '#');
      } else if (tile === 'O') {
        newRow.push('[', ']');
      } else if (tile === '.') {
        newRow.push('.', '.');
      } else if (tile === '@') {
        newRow.push('@', '.');
      }
    }

    scaledMap.push(newRow);
  }

  const scaledRobot = { x: robot.x * 2, y: robot.y };
  return { map: scaledMap, moves, robot: scaledRobot };
};

function pushBoxes(
  map: string[][],
  startX: number,
  startY: number,
  dirX: number,
  dirY: number
) {
  // Adjust starting point if the robot hits the `]` side of the box
  if (map[startY][startX] === ']' && map[startY][startX - 1] === '[') {
    startX -= 1; // Move to the start of the box (`[`)
  }

  // Find cluster of boxes using BFS
  const queue = [
    [startX, startY],
    [startX + 1, startY],
  ];
  const cluster = new Set<string>();
  cluster.add(`${startX},${startY}`);

  while (queue.length > 0) {
    const [x, y] = queue.shift();
    const nx = x + dirX;
    const ny = y + dirY;
    if (
      map[ny] &&
      map[ny][nx] === '[' &&
      map[ny][nx + 1] === ']' && // Ensure we identify the full box
      !cluster.has(`${nx},${ny}`)
    ) {
      cluster.add(`${nx},${ny}`);
      queue.push([nx, ny]);
      queue.push([nx + 1, ny]);
    } else if (
      map[ny] &&
      map[ny][nx - 1] === '[' &&
      map[ny][nx] === ']' && // Ensure we identify the full box
      !cluster.has(`${nx - 1},${ny}`)
    ) {
      cluster.add(`${nx - 1},${ny}`);
      queue.push([nx - 1, ny]);
      queue.push([nx, ny]);
    }
  }

  // Check if we can move the entire cluster one step in the direction dirX, dirY
  for (const pos of cluster) {
    const [x, y] = pos.split(',').map(Number);
    const nx = x + dirX;
    const ny = y + dirY;
    if (
      !map[ny] || // Out of bounds
      !map[ny][nx] || // Out of bounds
      map[ny][nx] === '#' || // Wall
      map[ny][nx + 1] === '#' || // Wall
      (map[ny][nx] === '[' &&
        map[ny][nx + 1] === ']' &&
        !cluster.has(`${nx},${ny}`)) // Other box
    ) {
      return false; // Cluster cannot be moved
    }
  }

  // Move the cluster
  // First, clear old positions
  for (const pos of cluster) {
    const [x, y] = pos.split(',').map(Number);
    map[y][x] = '.';
    map[y][x + 1] = '.'; // Clear the second part of the box
  }
  // Set new positions
  for (const pos of cluster) {
    const [x, y] = pos.split(',').map(Number);
    map[y + dirY][x + dirX] = '[';
    map[y + dirY][x + dirX + 1] = ']'; // Set the second part of the box
  }

  return true; // Successfully moved the cluster
}

function moveRobot(map: string[][], moves: string[], robot: Position) {
  for (const move of moves) {
    const dir = directions[move];

    const nextX = robot.x + dir.x;
    const nextY = robot.y + dir.y;

    // Check if the robot encounters a box from the left (`[`) or right (`]`)
    if (
      map[nextY] &&
      ((map[nextY][nextX] === '[' && map[nextY][nextX + 1] === ']') ||
        (map[nextY][nextX - 1] === '[' && map[nextY][nextX] === ']'))
    ) {
      // Determine the starting position of the box cluster
      const boxStartX = map[nextY][nextX] === '[' ? nextX : nextX - 1; // Adjust for hitting the `]`

      // Attempt to push the boxes
      if (pushBoxes(map, boxStartX, nextY, dir.x, dir.y)) {
        // Move the robot
        map[robot.y][robot.x] = '.';
        robot.x = nextX;
        robot.y = nextY;
        map[robot.y][robot.x] = '@';
      }
    } else if (map[nextY] && map[nextY][nextX] === '.') {
      // Move the robot to an empty space
      map[robot.y][robot.x] = '.';
      robot.x = nextX;
      robot.y = nextY;
      map[robot.y][robot.x] = '@';
    }
  }

  return map;
}

function calculateGPS(map: string[][]) {
  let gpsSum = 0;
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === 'O' || map[y][x] === '[') {
        gpsSum += y * 100 + x;
      }
    }
  }
  return gpsSum;
}

const second = (input: string): number => {
  const { map, moves, robot } = parseScaledInput(input);
  const updatedMap = moveRobot(map, moves, robot);
  return calculateGPS(updatedMap);
};

const expectedSecondSolution = '9021';

export { first, expectedFirstSolution, second, expectedSecondSolution };
