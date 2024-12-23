/**
 * Parse the input lines into an adjacency list representing an undirected graph.
 */
function parseNetworkMap(input: string): Map<string, Set<string>> {
  const adjacency = new Map<string, Set<string>>();
  const lines = input
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  for (const line of lines) {
    const [a, b] = line.split('-');
    if (!adjacency.has(a)) adjacency.set(a, new Set());
    if (!adjacency.has(b)) adjacency.set(b, new Set());
    adjacency.get(a).add(b);
    adjacency.get(b).add(a);
  }

  return adjacency;
}

/**
 * Find all sets of 3 computers where each is connected to the other two.
 * Returns an array of 3-element arrays [A, B, C].
 * We only record each set in a consistent sorted order so we don't double-count.
 */
function findTriangles(graph: Map<string, Set<string>>): string[][] {
  // Convert adjacency to a list of nodes so we can sort them.
  const nodes = Array.from(graph.keys()).sort();
  const triangles: string[][] = [];

  // For each pair of nodes (A,B), see if there's a node C in the intersection
  // of graph[A] and graph[B].
  for (let i = 0; i < nodes.length; i++) {
    const A = nodes[i];
    for (let j = i + 1; j < nodes.length; j++) {
      const B = nodes[j];
      const neighborsA = graph.get(A)!;
      if (!neighborsA.has(B)) continue;
      const neighborsB = graph.get(B)!;
      // Intersection of neighbors of A and B:
      const commonNeighbors = intersection(neighborsA, neighborsB);

      // Every neighbor C in that intersection forms a triangle A-B-C
      // but only if A < B < C (lexicographic sorting) to avoid duplicates
      for (const C of commonNeighbors) {
        if (C > B) {
          triangles.push([A, B, C]);
        }
      }
    }
  }

  return triangles;
}

function intersection(setA: Set<string>, setB: Set<string>): Set<string> {
  // Go through the smaller set to reduce iterations
  const [small, large] = setA.size < setB.size ? [setA, setB] : [setB, setA];
  const result = new Set<string>();
  for (const elem of small) {
    if (large.has(elem)) {
      result.add(elem);
    }
  }
  return result;
}

function countTrianglesWithT(triangles: string[][]): number {
  let count = 0;
  for (const tri of triangles) {
    // If any computer starts with 't', increment count.
    if (tri.some(name => name.startsWith('t'))) {
      count++;
    }
  }
  return count;
}

const first = (input: string) => {
  const graph = parseNetworkMap(input);
  const triangles = findTriangles(graph);
  return countTrianglesWithT(triangles);
}

const expectedFirstSolution = '7';


function findLargestClique(graph: Map<string, Set<string>>): string[] {
  const nodes = Array.from(graph.keys());
  let maxClique: string[] = [];

  function bronKerbosch(R: Set<string>, P: Set<string>, X: Set<string>) {
    if (P.size === 0 && X.size === 0) {
      if (R.size > maxClique.length) {
        maxClique = Array.from(R);
      }
      return;
    }

    const PArray = Array.from(P);
    for (const v of PArray) {
      const neighbors = graph.get(v)!;
      const newR = new Set(R).add(v);
      const newP = new Set([...P].filter(x => neighbors.has(x)));
      const newX = new Set([...X].filter(x => neighbors.has(x)));
      bronKerbosch(newR, newP, newX);
      P.delete(v);
      X.add(v);
    }
  }

  bronKerbosch(new Set(), new Set(nodes), new Set());
  return maxClique;
}

const second = (input: string) => {
  const graph = parseNetworkMap(input);
  const largestClique = findLargestClique(graph);
  return largestClique.sort().join(',');
}

const expectedSecondSolution = 'co,de,ka,ta';

export { first, expectedFirstSolution, second, expectedSecondSolution };
