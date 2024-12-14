type Robot = { px: number; py: number; vx: number; vy: number };

const parseInput = (input: string): Robot[] => {
  return input.split('\n').map((line: string) => {
    const [, px, py, vx, vy] = line.match(/p=(\d+),(\d+)\sv=(-?\d+),(-?\d+)/)!;
    return { px: +px, py: +py, vx: +vx, vy: +vy };
  });
};

const first = (input: string): number => {
  const robots = parseInput(input);
  const width = 101;
  const height = 103;
  const seconds = 100;

  // Simulate motion for `seconds`
  robots.forEach((robot) => {
    robot.px = (robot.px + robot.vx * seconds) % width;
    robot.py = (robot.py + robot.vy * seconds) % height;

    // Handle negative wrap-around
    if (robot.px < 0) {
      robot.px += width;
    }
    if (robot.py < 0) {
      robot.py += height;
    }
  });

  // Count robots in quadrants
  const quadrantCounts = [0, 0, 0, 0]; // [TL, TR, BL, BR]
  robots.forEach(({ px, py }) => {
    const halfWidth = Math.floor(width / 2);
    const halfHeight = Math.floor(height / 2);
    if (px < halfWidth && py < halfHeight) {
      quadrantCounts[0]++;
    } else if (px > halfWidth && py < halfHeight) {
      quadrantCounts[1]++;
    } else if (px < halfWidth && py > halfHeight) {
      quadrantCounts[2]++;
    } else if (px > halfWidth && py > halfHeight) {
      quadrantCounts[3]++;
    }
  });

  // Calculate safety factor
  return quadrantCounts.reduce((acc, count) => acc * count, 1);
};

const expectedFirstSolution = '21';

const second = (input: string) => {
  const robots = parseInput(input);
  const width = 101;
  const height = 103;

  let minTime = 0;
  let resultPattern: string[] = [];

  for (let time = 0; time < 10000; time++) {
    // Arbitrary large limit
    // Update positions
    const positions = robots.map(({ px, py, vx, vy }) => ({
      x: (((px + vx * time) % width) + width) % width,
      y: (((py + vy * time) % height) + height) % height,
    }));

    // sort positions by x and y
    positions.sort((a, b) => a.x - b.x || a.y - b.y);

    // Check if there are 80 consecutive points
    let consecutivePoints = 0;
    for (let i = 0; i < positions.length - 1; i++) {
      // absolute difference in x and y must be 1
      if (
        Math.abs(positions[i].x - positions[i + 1].x) +
          Math.abs(positions[i].y - positions[i + 1].y) ===
        1
      ) {
        consecutivePoints++;
      }
      if (consecutivePoints === 80) {
        minTime = time;

        // Create the visual pattern
        const grid = Array.from({ length: height }, () =>
          Array(width).fill('.')
        );
        positions.forEach(({ x, y }) => {
          grid[y][x] = '#';
        });
        resultPattern = grid.map((row) => row.join(''));
        console.log(resultPattern.join('\n'));
        break;
      }
    }
  }

  return minTime;
};

const expectedSecondSolution = '0';

export { first, expectedFirstSolution, second, expectedSecondSolution };
