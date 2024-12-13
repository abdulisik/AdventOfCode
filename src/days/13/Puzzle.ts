type Machine = {
  ax: number;
  ay: number;
  bx: number;
  by: number;
  px: number;
  py: number;
};

const parseInput = (input: string): Machine[] => {
  const lines = input.trim().split('\n\n');
  return lines.map((block) => {
    const lines = block.split('\n');
    const axAyMatch = lines[0].match(/Button A: X\+(\d+), Y\+(\d+)/);
    const bxByMatch = lines[1].match(/Button B: X\+(\d+), Y\+(\d+)/);
    const pxPyMatch = lines[2].match(/Prize: X=(\d+), Y=(\d+)/);

    if (!axAyMatch || !bxByMatch || !pxPyMatch) {
      throw new Error('Invalid input format');
    }

    return {
      ax: parseInt(axAyMatch[1], 10),
      ay: parseInt(axAyMatch[2], 10),
      bx: parseInt(bxByMatch[1], 10),
      by: parseInt(bxByMatch[2], 10),
      px: parseInt(pxPyMatch[1], 10),
      py: parseInt(pxPyMatch[2], 10),
    };
  });
};

function solveMachine(machine: Machine): [number, number] | null {
  const { ax, ay, bx, by, px, py } = machine;

  const detM = ax * by - bx * ay;
  if (detM === 0) {
    // No unique solution
    return null;
  }

  const detCA = px * by - bx * py;
  const detCB = ax * py - px * ay;

  // A and B must be integers and non-negative
  const A = detCA / detM;
  const B = detCB / detM;

  if (Number.isInteger(A) && Number.isInteger(B) && A >= 0 && B >= 0) {
    return [A, B];
  }

  return null;
}

const first = (input: string) => {
  const machines = parseInput(input);
  let totalCost = 0;

  for (const machine of machines) {
    const result = solveMachine(machine);
    if (result) {
      const [A, B] = result;
      totalCost += 3 * A + B;
    }
  }

  return totalCost;
};

const expectedFirstSolution = '480';

const second = (input: string) => {
  const machines = parseInput(input);
  let totalCost = 0;

  for (const machine of machines) {
    machine.px += 10000000000000;
    machine.py += 10000000000000;
    const result = solveMachine(machine);
    if (result) {
      const [A, B] = result;
      totalCost += 3 * A + B;
    }
  }

  return totalCost;
};

const expectedSecondSolution = '875318608908';

export { first, expectedFirstSolution, second, expectedSecondSolution };
