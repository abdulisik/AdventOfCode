const directions = [
  [0, 1], // Right
  [1, 0], // Down
  [0, -1], // Left
  [-1, 0], // Up
];

const first = (input: string): number => {
  const map = input.split('\n').map((row) => row.split(''));
  const rows = map.length;
  const cols = map[0].length;
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));

  const isValid = (x: number, y: number) =>
    x >= 0 && y >= 0 && x < rows && y < cols;

  const bfs = (startX: number, startY: number): [number, number] => {
    const queue: [number, number][] = [[startX, startY]];
    const plantType = map[startX][startY];
    let area = 0;
    let perimeter = 0;

    visited[startX][startY] = true;

    while (queue.length > 0) {
      const [x, y] = queue.shift()!;
      area++;

      for (const [dx, dy] of directions) {
        const nx = x + dx;
        const ny = y + dy;

        if (!isValid(nx, ny) || map[nx][ny] !== plantType) {
          // Out of bounds or different plant type contributes to the perimeter
          perimeter++;
        } else if (!visited[nx][ny]) {
          // Unvisited cell of the same plant type
          visited[nx][ny] = true;
          queue.push([nx, ny]);
        }
      }
    }

    return [area, perimeter];
  };

  let totalPrice = 0;

  for (let x = 0; x < rows; x++) {
    for (let y = 0; y < cols; y++) {
      if (!visited[x][y]) {
        const [area, perimeter] = bfs(x, y);
        totalPrice += area * perimeter;
      }
    }
  }

  return totalPrice;
};

const expectedFirstSolution = '140';

const second = (input: string): number => {
  const map = input.split('\n').map((row) => row.split(''));
  const rows = map.length;
  const cols = map[0].length;
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));

  const isValid = (x: number, y: number) =>
    x >= 0 && y >= 0 && x < rows && y < cols;

  const bfs = (startX: number, startY: number): [number, number] => {
    const queue: [number, number][] = [[startX, startY]];
    const plantType = map[startX][startY];
    let area = 0;
    let sideCount = 0;
    // Map < directions to row and column indexes>
    const sidesMap = new Map<string, [number, number][]>();

    visited[startX][startY] = true;

    for (let i = 0; i < queue.length; i++) {
      const [x, y] = queue[i];
      area++;

      for (const [dx, dy] of directions) {
        const nx = x + dx;
        const ny = y + dy;

        if (!isValid(nx, ny) || map[nx][ny] !== plantType) {
          // Out of bounds or different plant type contributes to the sides
          // Found an edge, keep the row and column index, per direction
          const sideKey = `${dx},${dy}`;
          if (!sidesMap.has(sideKey)) {
            sidesMap.set(sideKey, [[x, y]]);
          } else {
            sidesMap.get(sideKey)!.push([x, y]);
          }
        } else if (!visited[nx][ny]) {
          // Unvisited cell of the same plant type
          visited[nx][ny] = true;
          queue.push([nx, ny]);
        }
      }
    }

    // Calculate the continuous edges as one side
    sidesMap.forEach((sides, direction) => {
      // Within the sidesMap, sort the sides by row index first depending on the direction
      sides.sort((a, b) => {
        if (direction.startsWith('0')) {
          if (a[1] === b[1]) {
            return a[0] - b[0];
          }
          return a[1] - b[1];
        } else {
          if (a[0] === b[0]) {
            return a[1] - b[1];
          }
          return a[0] - b[0];
        }
      });
      for (let i = 0; i < sides.length - 1; i++) {
        // regardless of direction, row and column difference sum between consecutive sides must be exactly 1 to be considered consecutive
        if (
          Math.abs(sides[i][0] - sides[i + 1][0]) +
            Math.abs(sides[i][1] - sides[i + 1][1]) ===
          1
        ) {
          // If the sides are consecutive, consider them as one side
          sides.splice(i, 1);
          i--; // Adjust the index after removing an element
        }
      }
      sideCount += sides.length;
    });
    return [area, sideCount];
  };

  let totalPrice = 0;

  for (let x = 0; x < rows; x++) {
    for (let y = 0; y < cols; y++) {
      if (!visited[x][y]) {
        const [area, sides] = bfs(x, y);
        totalPrice += area * sides;
      }
    }
  }

  return totalPrice;
};

const expectedSecondSolution = '236';

export { first, expectedFirstSolution, second, expectedSecondSolution };
