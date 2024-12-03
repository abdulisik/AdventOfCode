const first = (input: string) => {
  // Remove line breaks and extra spaces
  const sanitizedInput = input.replace(/\s+/g, '');

  // Regex to match valid mul(X,Y) instructions
  const regex = /mul\((\d{1,3}),(\d{1,3})\)/g;

  // Extract matches and calculate the sum of their products
  let total = 0;
  let match;
  while ((match = regex.exec(sanitizedInput)) !== null) {
    const x = parseInt(match[1], 10);
    const y = parseInt(match[2], 10);
    total += x * y;
  }

  return total;
};

const expectedFirstSolution = '161';

const second = (input: string) => {
  // Remove line breaks and spaces
  const sanitizedInput = input.replace(/\s+/g, '');

  // Regex to match mul(X,Y), do(), and don't()
  const regex = /mul\((\d{1,3}),(\d{1,3})\)|do\(\)|don't\(\)/g;

  // Track whether mul instructions are enabled
  let enabled = true;
  let total = 0;

  // Extract matches and process them
  let match;
  while ((match = regex.exec(sanitizedInput)) !== null) {
    if (match[0] === 'do()') {
      // Enable future mul instructions
      enabled = true;
    } else if (match[0] === "don't()") {
      // Disable future mul instructions
      enabled = false;
    } else if (match[1] && match[2] && enabled) {
      // Process valid mul(X,Y) only if enabled
      const x = parseInt(match[1], 10);
      const y = parseInt(match[2], 10);
      total += x * y;
    }
  }

  return total;
};

const expectedSecondSolution = '48';

export { first, expectedFirstSolution, second, expectedSecondSolution };
