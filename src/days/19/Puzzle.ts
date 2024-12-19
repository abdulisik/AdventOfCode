
const canConstructDesign = (design: string, patterns: Set<string>): number => {
  const dp = Array(design.length + 1).fill(0);
  dp[0] = 1; // Base case: empty design can always be constructed

  for (let i = 1; i <= design.length; i++) {
    for (let j = 0; j < i; j++) {
      if (patterns.has(design.substring(j, i))) {
        dp[i] += dp[j];
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
  const [patternsLine, emptyLine, ...designs] = input.trim().split('\n');
  const patterns = new Set(patternsLine.split(', '));

  let possibleDesignsCount = 0;

  for (const design of designs) {
    possibleDesignsCount += canConstructDesign(design, patterns);
  }

  return possibleDesignsCount;
};

const expectedSecondSolution = '16';

export { first, expectedFirstSolution, second, expectedSecondSolution };
