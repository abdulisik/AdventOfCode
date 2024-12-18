// src/days/17/Puzzle.ts

const simulateProgram = (A: number, B: number, C: number, program: number[]) => {
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
        B = Number(BigInt(B) ^ BigInt(operand));
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
        B = Number(BigInt(B) ^ BigInt(C));
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

const first = (input: string) => {
  // Parse the input to extract register values and program
  const lines = input.trim().split('\n');
  let A = parseInt(lines[0].split(': ')[1], 10);
  let B = parseInt(lines[1].split(': ')[1], 10);
  let C = parseInt(lines[2].split(': ')[1], 10);
  const program = lines[4].split(': ')[1].split(',').map(Number);

  return simulateProgram(A, B, C, program);
};

const expectedFirstSolution = '4,6,3,5,6,3,5,2,1,0';

const second = (input: string) => {
  // Parse the input to extract register values and program
  const lines = input.trim().split('\n');
  const initialB = parseInt(lines[1].split(': ')[1], 10);
  const initialC = parseInt(lines[2].split(': ')[1], 10);
  const rawProgram = lines[4].split(': ')[1];
  const program = rawProgram.split(',').map(Number);

  // Function to simulate the program for a given A and check if it matches the expected output
  const simulateRun = (A: number) => {
    const output = simulateProgram(A, initialB, initialC, program);
    return output === rawProgram.slice(rawProgram.length - output.length);
  };

  // Calculate the required initial value of A
  const calculateInitialA = () => {
    let possibleA = [0];
    const outputLength = program.length;

    for (let i = 0; i < outputLength; i++) {
      const newPossibleA = [];
      for (const a of possibleA) {
        for (let j = 0; j < 8; j++) {
          const candidateA = a * 8 + j;
          if (simulateRun(candidateA)) {
            newPossibleA.push(candidateA);
          }
        }
      }
      // Remove 0 to not restart the search
      possibleA = newPossibleA.filter(a => a !== 0);
    }

    return Math.min(...possibleA);
  };

  return calculateInitialA();
};

const expectedSecondSolution = '117440';

export { first, expectedFirstSolution, second, expectedSecondSolution };
