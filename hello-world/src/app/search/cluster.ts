export function dist(v1: number[], v2: number[]): number {
  return Math.sqrt(
    v1.reduce(
      (s: number, v1_i: number, i: number) => s + Math.pow(v1_i - v2[i], 2),
      0
    )
  );
}

export function min_dist(v: number[], cluster: number[][]): [number, number] {
  let min_d: number = Infinity;
  let i: number = -1;
  cluster.forEach((c: number[], idx: number) => {
    let d: number = dist(c, v);
    if (d < min_d) {
      min_d = d;
      i = idx;
    }
  });
  return [i, min_d];
}

export function kmeans(v: number[][], k: number): number[][] {
  let n: number = v.length;
  let m: number = v[0].length;
  let idxs: number[] = [...Array(n).keys()];
  let clusters: number[][] = [...Array(k).keys()].map(() => {
    let idx: number = Math.floor(Math.random() * idxs.length);
    let v_i: number[] = v[idxs[idx]];
    idxs = idxs.slice(0, idx).concat(idxs.slice(idx + 1));
    return v_i;
  });
  for (let i: number = 0; i < 10; i++) {
    let cluster_vs: number[][] = clusters.map(() => []);
    v.forEach((arr: number[], i: number) => {
      cluster_vs[min_dist(arr, clusters)[0]].push(i);
    });
    clusters = cluster_vs.map((vs: number[]) =>
      vs
        .reduce(
          (arr: number[], i: number) =>
            arr.map((a: number, j: number) => a + v[i][j]),
          Array<number>(m).fill(0)
        )
        .map((v: number) => v / vs.length)
    );
  }
  return clusters;
}
