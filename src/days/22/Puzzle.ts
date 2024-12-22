const parseInput = (input: string): number[] => {
  return input
    .split('\n')
    .filter(line => line.length > 0)
    .map(line => Number.parseInt(line.trim()));
};

function mixAndPrune(secret: number, value: number): number {
  return Number(BigInt(secret) ^ BigInt(value)) % 16777216;
}

function generateSecretNumber(initialSecret: number, steps: number): number {
  let secret = initialSecret;
  for (let i = 0; i < steps; i++) {
    secret = mixAndPrune(secret, secret * 64);
    secret = mixAndPrune(secret, Math.floor(secret / 32));
    secret = mixAndPrune(secret, secret * 2048);
  }
  return secret;
}

function sum2000thSecretNumbers(initialSecrets: number[]): number {
  const steps = 2000;
  return initialSecrets.reduce((sum, initialSecret) => {
    const secret = generateSecretNumber(initialSecret, steps);
    return sum + secret;
  }, 0);
}

const first = (input: string) => {
  const initialSecrets = parseInput(input);
  const result = sum2000thSecretNumbers(initialSecrets);
  return result;
}

const expectedFirstSolution = '37327623';

function findBestSequence(initialSecrets: number[]): number {
  const steps = 2000;
  const globalSequenceProfitMap = new Map<string, number>();

  for (const initialSecret of initialSecrets) {
    let secret = initialSecret;
    let lastPrice;
    const priceChanges = [];
    const sequenceProfitMap = new Map<string, number>();

    for (let i = 0; i < steps; i++) {
      secret = mixAndPrune(secret, secret * 64);
      secret = mixAndPrune(secret, Math.floor(secret / 32));
      secret = mixAndPrune(secret, secret * 2048);
      const price = secret % 10;
      const change = price - lastPrice;
      lastPrice = price;
      priceChanges.push(change);
      if (i >= 4) {
        priceChanges.shift();
        const sequence = priceChanges.join(',');
        sequenceProfitMap.set(sequence, sequenceProfitMap.get(sequence) ?? price);
      }
    }

    // Combine the current buyer's sequenceProfitMap into the global map
    for (const [sequence, profit] of sequenceProfitMap.entries()) {
      globalSequenceProfitMap.set(sequence, (globalSequenceProfitMap.get(sequence) ?? 0) + profit);
    }
  }

  // Find the maximum profit from the global map
  let maxBananas = 0;
  for (const profit of globalSequenceProfitMap.values()) {
    maxBananas = Math.max(maxBananas, profit);
  }
  return maxBananas;
}

const second = (input: string) => {
  const initialSecrets = parseInput(input);
  return findBestSequence(initialSecrets);
};

const expectedSecondSolution = '23';

export { first, expectedFirstSolution, second, expectedSecondSolution };
