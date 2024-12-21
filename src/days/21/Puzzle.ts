type Position = [number, number];

const parseInput = (input: string): string[] => {
  return input
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
};

const numericalKeypad = new Map<string, Position>([
  ['7', [0, 0]], ['8', [1, 0]], ['9', [2, 0]],
  ['4', [0, 1]], ['5', [1, 1]], ['6', [2, 1]],
  ['1', [0, 2]], ['2', [1, 2]], ['3', [2, 2]],
  [' ', [0, 3]], ['0', [1, 3]], ['A', [2, 3]]
]);

const directionsKeypad = new Map<string, Position>([
  [' ', [0, 0]], ['^', [1, 0]], ['A', [2, 0]],
  ['<', [0, 1]], ['v', [1, 1]], ['>', [2, 1]]
]);

const moves: Record<string, string[]> = {};

function findMoves(from: Position, to: Position, avoid: Position): string[] {
  const [toX, toY] = to;
  const [avoidX, avoidY] = avoid;

  const queue: Array<{ pos: Position; path: string }> = [{ pos: from, path: '' }];
  const results: string[] = [];

  while (queue.length > 0) {
    const { pos: [fromX, fromY], path } = queue.shift()!;

    if ((fromX === avoidX && fromY === avoidY) || (toX === avoidX && toY === avoidY)) {
      continue;
    }
    if (fromX === toX && fromY === toY) {
      results.push(path + 'A');
      continue;
    }

    if (fromX < toX) {
      queue.push({ pos: [fromX + 1, fromY], path: path + '>' });
    }
    if (fromX > toX) {
      queue.push({ pos: [fromX - 1, fromY], path: path + '<' });
    }
    if (fromY < toY) {
      queue.push({ pos: [fromX, fromY + 1], path: path + 'v' });
    }
    if (fromY > toY) {
      queue.push({ pos: [fromX, fromY - 1], path: path + '^' });
    }
  }

  return results;
}

function precomputeMoves() {
  for (let [a, from] of numericalKeypad) {
    for (let [b, to] of numericalKeypad) {
      moves[a + b] = [...findMoves(from, to, numericalKeypad.get(' ')!)];
    }
  }
  for (let [a, from] of directionsKeypad) {
    for (let [b, to] of directionsKeypad) {
      moves[a + b] = [...findMoves(from, to, directionsKeypad.get(' ')!)];
    }
  }
}

const cache = new Map<string, number>();

function countMinimumSteps(buttons: string, directionalConsoles: number): number {
  const cacheKey = `${buttons}-${directionalConsoles}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }

  if (directionalConsoles === 0) {
    return buttons.length;
  }

  let steps = 0;
  let a = 'A';
  for (let b of buttons) {
    const possiblePaths = moves[a + b];
    const minSteps = Math.min(...possiblePaths.map(p => countMinimumSteps(p, directionalConsoles - 1)));
    steps += minSteps;
    a = b;
  }

  cache.set(cacheKey, steps);
  return steps;
}

function getComplexity(buttons: string, robots: number): number {
  const number = parseInt(buttons.slice(0, -1), 10);
  const steps = countMinimumSteps(buttons, robots + 1);
  return number * steps;
}

const first = (input: string): number => {
  const codes: string[] = parseInput(input);
  precomputeMoves();
  return codes.reduce((sum, line) => sum + getComplexity(line, 2), 0);
};

const expectedFirstSolution = '126384';

const second = (input: string) => {
  const codes: string[] = parseInput(input);
  precomputeMoves();
  return codes.reduce((sum, line) => sum + getComplexity(line, 25), 0);
};

const expectedSecondSolution = '154115708116294';

export { first, expectedFirstSolution, second, expectedSecondSolution };
