const blink = (stone: number): number[] => {
  let result: number[] = [];
  if (stone === 0) {
    result = [1];
  } else if (stone.toString().length % 2 === 0) {
    const str = stone.toString();
    const mid = str.length / 2;
    result = [parseInt(str.slice(0, mid), 10), parseInt(str.slice(mid), 10)];
  } else {
    result = [stone * 2024];
  }
  return result;
};

const first = (input: string) => {
  let initialStones = input.split(' ').map(Number);
  const numRounds = 25;
  for (let i = 0; i < numRounds; i++) {
    const newStones: number[] = [];
    for (const stone of initialStones) {
      newStones.push(...blink(stone));
    }
    initialStones = newStones;
  }
  return initialStones.length;
};

const expectedFirstSolution = '55312';

const blinkStonesOptimized = (stones: number[], blinks: number): number => {
  const memo: Map<number, number[]> = new Map();

  // Function to calculate transformations
  const transformStone = (stone: number): number[] => {
    if (memo.has(stone)) {
      return memo.get(stone)!;
    }
    const result: number[] = blink(stone);
    memo.set(stone, result);
    return result;
  };

  let currentCounts: Map<number, number> = new Map();
  for (const stone of stones) {
    currentCounts.set(stone, (currentCounts.get(stone) || 0) + 1);
  }

  for (let blink = 0; blink < blinks; blink++) {
    const nextCounts: Map<number, number> = new Map();

    for (const [stone, count] of currentCounts.entries()) {
      const transformed = transformStone(stone);
      for (const newStone of transformed) {
        nextCounts.set(newStone, (nextCounts.get(newStone) || 0) + count);
      }
    }
    currentCounts = nextCounts;
  }

  // Calculate the total number of stones
  let totalStones = 0;
  for (const count of currentCounts.values()) {
    totalStones += count;
  }

  return totalStones;
};

const second = (input: string) => {
  const initialStones = input.split(' ').map(Number);
  return blinkStonesOptimized(initialStones, 75);
};

const expectedSecondSolution = '65601038650482';

export { first, expectedFirstSolution, second, expectedSecondSolution };
