const first = (input: string) => {
  // Parse input and sort both lists
  const [left, right] = input
    .trim()
    .split('\n')
    .reduce<[number[], number[]]>(
      ([l, r], line) => {
        const [valL, valR] = line.split(/\s+/).map(Number);
        l.push(valL);
        r.push(valR);
        return [l, r];
      },
      [[], []]
    );

  left.sort((a, b) => a - b);
  right.sort((a, b) => a - b);

  // Calculate total distance
  return left.reduce(
    (total, val, idx) => total + Math.abs(val - right[idx]),
    0
  );
};

const expectedFirstSolution = '11';

const second = (input: string) => {
  const rightFreq: Map<number, number> = new Map();
  const leftFreq: Map<number, number> = new Map();

  // Parse input and populate frequency maps
  input
    .trim()
    .split('\n')
    .forEach((line) => {
      const [l, r] = line.split(/\s+/).map(Number);
      rightFreq.set(r, (rightFreq.get(r) || 0) + 1);
      leftFreq.set(l, (leftFreq.get(l) || 0) + 1);
    });

  // Calculate total similarity score
  let totalSimilarity = 0;
  leftFreq.forEach((leftCount, num) => {
    const rightCount = rightFreq.get(num) || 0;
    totalSimilarity += num * leftCount * rightCount;
  });

  return totalSimilarity;
};

const expectedSecondSolution = '31';

export { first, expectedFirstSolution, second, expectedSecondSolution };
