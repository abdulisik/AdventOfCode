const parseInput = (input: string) => {
  const [rulesSection, updatesSection] = input.trim().split('\n\n');

  const rules = rulesSection.split('\n').map((line) => {
    const [x, y] = line.split('|').map(Number);
    return [x, y];
  });

  const updates = updatesSection
    .split('\n')
    .map((line) => line.split(',').map(Number));

  return { rules, updates };
};

const buildReverseRules = (rules: number[][]) => {
  const reverseMap: Map<number, Set<number>> = new Map();

  for (const [x, y] of rules) {
    if (!reverseMap.has(y)) {
      reverseMap.set(y, new Set());
    }
    reverseMap.get(y)!.add(x); // `Y` must follow `X`
  }

  return reverseMap;
};

const isValidUpdateWithReverseRules = (
  update: number[],
  reverseRules: Map<number, Set<number>>
): boolean => {
  // Iterate through the update
  for (let i = 0; i < update.length; i++) {
    const currentPage = update[i];
    const requiredBefore = reverseRules.get(currentPage) || new Set();

    // Ensure all required pages appear before this page
    for (const requiredPage of requiredBefore) {
      if (update.indexOf(requiredPage) > i) {
        return false; // Rule violated: `requiredPage` comes after `currentPage`
      }
    }
  }

  return true;
};

const first = (input: string) => {
  const { rules, updates } = parseInput(input);
  const reverseRules = buildReverseRules(rules);

  let totalMiddlePages = 0;

  for (const update of updates) {
    if (isValidUpdateWithReverseRules(update, reverseRules)) {
      const middleIndex = Math.floor(update.length / 2);
      totalMiddlePages += update[middleIndex];
    }
  }

  return totalMiddlePages;
};

const expectedFirstSolution = '143';

const buildGraph = (rules: number[][], updates: number[][]) => {
  const graph: Map<number, Set<number>> = new Map();

  // Initialize graph for all pages in rules
  for (const [x, y] of rules) {
    if (!graph.has(x)) {
      graph.set(x, new Set());
    }
    if (!graph.has(y)) {
      graph.set(y, new Set());
    }
    graph.get(x)!.add(y);
  }

  // Ensure all pages in updates are included in the graph map
  for (const update of updates) {
    for (const page of update) {
      if (!graph.has(page)) {
        graph.set(page, new Set());
      }
    }
  }

  return { graph };
};

const topologicalSort = (
  update: number[],
  graph: Map<number, Set<number>>
): number[] => {
  const queue: number[] = [];
  const sorted: number[] = [];
  const indegreeCopy: Map<number, number> = new Map();

  // Build a local graph and indegree map for the update
  for (const page of update) {
    indegreeCopy.set(page, 0); // Initialize local indegree
  }
  for (const [before, afterSet] of graph) {
    if (update.includes(before)) {
      for (const after of afterSet) {
        if (update.includes(after)) {
          indegreeCopy.set(after, (indegreeCopy.get(after) || 0) + 1);
        }
      }
    }
  }

  // Initialize queue with nodes having indegree = 0
  for (const [page, indegreeValue] of indegreeCopy) {
    if (indegreeValue === 0) {
      queue.push(page);
    }
  }

  // Perform topological sorting
  while (queue.length > 0) {
    const node = queue.shift()!;
    sorted.push(node);

    for (const neighbor of graph.get(node) || []) {
      if (update.includes(neighbor)) {
        indegreeCopy.set(neighbor, indegreeCopy.get(neighbor)! - 1);
        if (indegreeCopy.get(neighbor) === 0) {
          queue.push(neighbor);
        }
      }
    }
  }

  // Check if all pages in the update were sorted
  if (sorted.length !== update.length) {
    console.error('Incomplete Sort Detected');
    console.log('Update:', update);
    console.log('Remaining Indegree Map:', Array.from(indegreeCopy.entries()));
    throw new Error(`Topological sort incomplete for update: ${update}`);
  }

  return sorted;
};

const isValidUpdate = (update: number[], graph: Map<number, Set<number>>) => {
  const pageIndex = new Map<number, number>();
  for (let i = 0; i < update.length; i++) {
    pageIndex.set(update[i], i);
  }

  for (const [before, afterSet] of graph) {
    for (const after of afterSet) {
      if (pageIndex.has(before) && pageIndex.has(after)) {
        if (pageIndex.get(before)! > pageIndex.get(after)!) {
          return false;
        }
      }
    }
  }

  return true;
};

const second = (input: string) => {
  const { rules, updates } = parseInput(input);
  const { graph } = buildGraph(rules, updates);

  let totalMiddlePages = 0;

  for (const update of updates) {
    if (!isValidUpdate(update, graph)) {
      const sortedUpdate = topologicalSort(update, graph);

      // Ensure the sorted list is not empty
      if (sortedUpdate.length === 0) {
        throw new Error(`Failed to sort update: ${update}`);
      }

      const middleIndex = Math.floor(sortedUpdate.length / 2);
      totalMiddlePages += sortedUpdate[middleIndex];
    }
  }

  return totalMiddlePages;
};

const expectedSecondSolution = '123';

export { first, expectedFirstSolution, second, expectedSecondSolution };
