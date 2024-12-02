const first = (input: string) => {
  let safeCount = 0;
  input
    .trim()
    .split('\n')
    .forEach((line) => {
      const level: number[] = line.split(/\s+/).map(Number);
      if (isSafeReport(level)) {
        safeCount++;
      }
    });
  return safeCount;
};

const expectedFirstSolution = '2';

const isSafeReport = (level: number[]) => {
  const direction = level[1] - level[0];
  if (direction === 0) {
    return false;
  }
  const lowerBoundary = direction > 0 ? 1 : -3;
  const upperBoundary = direction > 0 ? 3 : -1;

  for (let i = 1; i < level.length; i++) {
    const diff = level[i] - level[i - 1];
    if (diff < lowerBoundary || diff > upperBoundary) {
      return false;
    }
  }

  return true;
};

const checkSafety = (level: number[]): boolean => {
  // If the report is already safe, return true
  if (isSafeReport(level)) {
    return true;
  }

  // Simulate removing each level
  for (let i = 0; i < level.length; i++) {
    const modified = level.slice(0, i).concat(level.slice(i + 1));
    if (isSafeReport(modified)) {
      return true;
    }
  }

  return false;
};

const second = (input: string) => {
  let safeCount = 0;
  input
    .trim()
    .split('\n')
    .forEach((line) => {
      const level: number[] = line.split(/\s+/).map(Number);
      if (checkSafety(level)) {
        safeCount++;
      }
    });
  return safeCount;
};

const expectedSecondSolution = '4';

export { first, expectedFirstSolution, second, expectedSecondSolution };
