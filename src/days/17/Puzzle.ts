// src/days/17/Puzzle.ts

const first = (input: string) => {
  // Parse the input to extract register values and program
  const lines = input.trim().split('\n');
  let A = parseInt(lines[0].split(': ')[1], 10);
  let B = parseInt(lines[1].split(': ')[1], 10);
  let C = parseInt(lines[2].split(': ')[1], 10);
  const program = lines[4].split(': ')[1].split(',').map(Number);

  let instructionPointer = 0;
  const output: number[] = [];

  // Helper function to get combo operand value
  const getComboValue = (operand: number) => {
    if (operand <= 3) return operand;
    if (operand === 4) return A;
    if (operand === 5) return B;
    if (operand === 6) return C;
    throw new Error("Invalid combo operand");
  };

  // Execute the program
  while (instructionPointer < program.length) {
    const opcode = program[instructionPointer];
    const operand = program[instructionPointer + 1];

    switch (opcode) {
      case 0: // adv
        A = Math.trunc(A / Math.pow(2, getComboValue(operand)));
        break;
      case 1: // bxl
        B ^= operand;
        break;
      case 2: // bst
        B = getComboValue(operand) % 8;
        break;
      case 3: // jnz
        if (A !== 0) {
          instructionPointer = operand;
          continue; // Skip the usual pointer increment
        }
        break;
      case 4: // bxc
        B ^= C;
        break;
      case 5: // out
        output.push(getComboValue(operand) % 8);
        break;
      case 6: // bdv
        B = Math.trunc(A / Math.pow(2, getComboValue(operand)));
        break;
      case 7: // cdv
        C = Math.trunc(A / Math.pow(2, getComboValue(operand)));
        break;
      default:
        throw new Error("Invalid opcode");
    }

    instructionPointer += 2;
  }

  // Join the output values with commas
  return output.join(',');
};

const expectedFirstSolution = '4,6,3,5,6,3,5,2,1,0';

const second = (input: string) => {
  return 'solution 2';
};

const expectedSecondSolution = 'solution 2';

export { first, expectedFirstSolution, second, expectedSecondSolution };
