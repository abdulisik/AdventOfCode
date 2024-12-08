const parseInput = (input: string): Map<string, number[][]> => {
  const lines = input.trim().split('\n');
  const antennaMap: Map<string, number[][]> = new Map();

  for (let r = 0; r < lines.length; r++) {
    for (let c = 0; c < lines[r].length; c++) {
      const char = lines[r][c];
      if (char !== '.') {
        if (!antennaMap.has(char)) {
          antennaMap.set(char, []);
        }
        antennaMap.get(char)!.push([r, c]);
      }
    }
  }

  return antennaMap;
};

const calculateAntinodes = (
  antennas: number[][],
  numRows: number,
  numCols: number
): Set<string> => {
  const antinodes = new Set<string>();

  for (let i = 0; i < antennas.length; i++) {
    for (let j = i + 1; j < antennas.length; j++) {
      const [x1, y1] = antennas[i];
      const [x2, y2] = antennas[j];

      // Midpoint for antinode calculation
      const dx = x2 - x1;
      const dy = y2 - y1;

      // Antinode positions
      const antinode1 = [x1 - dx, y1 - dy];
      const antinode2 = [x2 + dx, y2 + dy];

      // Add valid positions to the set
      for (const [x, y] of [antinode1, antinode2]) {
        if (x >= 0 && x < numRows && y >= 0 && y < numCols) {
          antinodes.add(`${x},${y}`);
        }
      }
    }
  }

  return antinodes;
};

const first = (input: string) => {
  const antennaMap = parseInput(input);
  const numRows = input.trim().split('\n').length;
  const numCols = input.trim().split('\n')[0].length;

  const uniqueAntinodes = new Set<string>();

  for (const [, antennas] of antennaMap.entries()) {
    const antinodes = calculateAntinodes(antennas, numRows, numCols);
    for (const antinode of antinodes) {
      uniqueAntinodes.add(antinode);
    }
  }

  return uniqueAntinodes.size;
};

const expectedFirstSolution = '14';

const second = (input: string) => {
  const antennaMap = parseInput(input);
  const numRows = input.trim().split('\n').length;
  const numCols = input.trim().split('\n')[0].length;

  const uniqueAntinodes = new Set<string>();

  for (const [, antennas] of antennaMap.entries()) {
    for (let i = 0; i < antennas.length; i++) {
      for (let j = i + 1; j < antennas.length; j++) {
        const [x1, y1] = antennas[i];
        const [x2, y2] = antennas[j];

        // Calculate the direction vector
        const dx = x2 - x1;
        const dy = y2 - y1;

        // Include both antennas as antinodes
        uniqueAntinodes.add(`${x1},${y1}`);
        uniqueAntinodes.add(`${x2},${y2}`);

        // Extend in both directions
        let nx = x1 - dx;
        let ny = y1 - dy;
        while (nx >= 0 && nx < numRows && ny >= 0 && ny < numCols) {
          uniqueAntinodes.add(`${nx},${ny}`);
          nx -= dx;
          ny -= dy;
        }

        nx = x2 + dx;
        ny = y2 + dy;
        while (nx >= 0 && nx < numRows && ny >= 0 && ny < numCols) {
          uniqueAntinodes.add(`${nx},${ny}`);
          nx += dx;
          ny += dy;
        }
      }
    }
  }

  return uniqueAntinodes.size;
};

const expectedSecondSolution = '34';

export { first, expectedFirstSolution, second, expectedSecondSolution };
