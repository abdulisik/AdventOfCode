
const canConstructDesign = (design: string, patterns: Set<string>): boolean => {
  const dp = Array(design.length + 1).fill(false);
  dp[0] = true; // Base case: empty design can always be constructed

  for (let i = 1; i <= design.length; i++) {
    for (let j = 0; j < i; j++) {
      if (dp[j] && patterns.has(design.substring(j, i))) {
        dp[i] = true;
        break;
      }
    }
  }

  return dp[design.length];
};

const first = (input: string): number => {
  const [patternsLine, emptyLine, ...designs] = input.trim().split('\n');
  const patterns = new Set(patternsLine.split(', '));

  let possibleDesignsCount = 0;

  for (const design of designs) {
    if (canConstructDesign(design, patterns)) {
      possibleDesignsCount++;
    }
  }

  return possibleDesignsCount;
};

const expectedFirstSolution = '6';

const second = (input: string) => {
  return 'solution 2';
};

const expectedSecondSolution = 'solution 2';

export { first, expectedFirstSolution, second, expectedSecondSolution };
