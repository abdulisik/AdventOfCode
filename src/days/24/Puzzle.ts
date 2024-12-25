type WireValues = Map<string, number>;

function parseInput(input: string): { initialValues: WireValues, operations: string[] } {
  const lines = input.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  const initialValues = new Map<string, number>();
  const operations: string[] = [];

  for (const line of lines) {
    if (line.includes(':')) {
      const [wire, value] = line.split(':').map(part => part.trim());
      initialValues.set(wire, parseInt(value, 10));
    } else {
      operations.push(line);
    }
  }

  return { initialValues, operations };
}

function evaluateGate(op: string, a: number, b: number): number {
  switch (op) {
    case 'AND': return a & b;
    case 'OR': return a | b;
    case 'XOR': return a ^ b;
    default: throw new Error(`Unknown operation: ${op}`);
  }
}

function simulateCircuit(initialValues: WireValues, operations: string[]): WireValues {
  const wireValues = new Map(initialValues);
  let pendingOperations = [...operations];
  let progress = true;

  while (progress && pendingOperations.length > 0) {
    progress = false;
    const nextPendingOperations: string[] = [];

    for (const operation of pendingOperations) {
      const [left, right] = operation.split('->').map(part => part.trim());
      const [input1, op, input2] = left.split(' ');

      const value1 = wireValues.get(input1);
      const value2 = wireValues.get(input2);

      if (value1 !== undefined && value2 !== undefined) {
        const result = evaluateGate(op, value1, value2);
        wireValues.set(right, result);
        progress = true;
      } else {
        nextPendingOperations.push(operation);
      }
    }

    pendingOperations = nextPendingOperations;
  }

  return wireValues;
}

function computeOutput(wireValues: WireValues): number {
  const zWires = Array.from(wireValues.entries())
    .filter(([wire, _]) => wire.startsWith('z'))
    .sort(([a, _a], [b, _b]) => parseInt(a.slice(1)) - parseInt(b.slice(1)));

  let binaryString = '';
  for (const [_, value] of zWires) {
    binaryString = value + binaryString;
  }

  return parseInt(binaryString, 2);
}

const first = (input: string): number => {
  const { initialValues, operations } = parseInput(input);
  const wireValues = simulateCircuit(initialValues, operations);
  return computeOutput(wireValues);
}

const expectedFirstSolution = '2024';

const second = (input: string) => {
  return 'solution 2';
};

const expectedSecondSolution = 'solution 2';

export { first, expectedFirstSolution, second, expectedSecondSolution };
