const parseSchematics = (schematics: string[]): { locks: number[][], keys: number[][] } => {
  const locks: number[][] = [];
  const keys: number[][] = [];

  schematics.forEach(schematic => {
    const rows = schematic.split('\n');
    const heights = Array(rows[0].length).fill(0);
    rows.forEach((row, rowIndex) => {
      // Skip the first and last rows, they are only for determining keys vs locks
      if (rowIndex == 0 || rowIndex == rows.length-1)
        return;
      row.split('').forEach((char, colIndex) => {
        if (char === '#') {
          heights[colIndex]++;
        }
      });
    });

    // Determine if it's a lock or a key
    if (rows[0].includes('#')) {
      locks.push(heights);
    } else {
      keys.push(heights);
    }
  });

  return { locks, keys };
};

const first = (input: string) => {

  const schematics = input.split('\n\n');
  const { locks, keys } = parseSchematics(schematics);

  let validPairs = 0;

  locks.forEach(lock => {
    keys.forEach(key => {
      const fits = lock.every((lockHeight, index) => lockHeight + key[index] <= lock.length);
      if (fits) validPairs++;
    });
  });

  return validPairs;
};

const expectedFirstSolution = '3';

const second = (input: string) => {
  return 'solution 2';
};

const expectedSecondSolution = 'solution 2';

export { first, expectedFirstSolution, second, expectedSecondSolution };
