const parseInput = (input: string) => {
  return input
    .trim()
    .split('\n')
    .map((line) => {
      const [target, numbers] = line.split(': ');
      return {
        target: Number(target),
        numbers: numbers.split(' ').map(Number),
      };
    });
};

const canMatchTarget = (
  target: number,
  current: number,
  numbers: number[]
): boolean => {
  if (numbers.length === 0) {
    return target === current;
  }
  const next = numbers[0];
  return (
    canMatchTarget(target, current + next, numbers.slice(1)) ||
    canMatchTarget(target, current * next, numbers.slice(1))
  );
};

const first = (input: string) => {
  const equations = parseInput(input);
  let total = 0;

  for (const { target, numbers } of equations) {
    if (canMatchTarget(target, numbers[0], numbers.slice(1))) {
      total += target;
    }
  }

  return total;
};

const expectedFirstSolution = '3749';

const canMatchTargetTwo = (
  target: number,
  current: number,
  numbers: number[]
): boolean => {
  if (numbers.length === 0) {
    return target === current;
  }
  const next = numbers[0];
  return (
    canMatchTargetTwo(target, current + next, numbers.slice(1)) ||
    canMatchTargetTwo(target, current * next, numbers.slice(1)) ||
    canMatchTargetTwo(target, Number(`${current}${next}`), numbers.slice(1))
  );
};

const second = (input: string) => {
  const equations = parseInput(input);
  let total = 0;

  for (const { target, numbers } of equations) {
    if (canMatchTargetTwo(target, numbers[0], numbers.slice(1))) {
      total += target;
    }
  }

  return total;
};

const expectedSecondSolution = '11387';

export { first, expectedFirstSolution, second, expectedSecondSolution };
