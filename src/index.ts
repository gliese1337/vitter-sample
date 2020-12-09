//Vitter, J.S. - An Efficient Algorithm for Sequential Random Sampling - ACM Trans. Math. Software 11 (1985), 37-57.

const negalphainv = -13;
export function * skip(k: number, N: number) {
  let qu1 = N - k + 1;
  let S = 0; 
  let threshold = -negalphainv*k;
 
  let kinv = 1/k;
  let Vprime = Math.pow(Math.random(), kinv);

  while (k > 1 && threshold < N) {
    // calculating skip for k and N with Method D
    const kmin1inv = 1/(k - 1);
 
    for (;;) {
      let X!: number;
      for (;;) {
        X = N * (1 - Vprime);
        S = Math.floor(X);
 
        if (S < qu1) break;
 
        Vprime = Math.pow(Math.random(), kinv);
      }

      const y1 = Math.pow(Math.random() * N / qu1, kmin1inv);
      Vprime = y1 * (1 - X / N) * (qu1 / (qu1 - S));
       
      if (Vprime <= 1) break;
       
      let y2 = 1; 
      let top = N - 1;
      let bottom: number;       
      let limit: number;
      if (k - 1 > S) {
        bottom = N - k;
        limit = N - S;
      } else {
        bottom = N - S - 1; 
        limit = qu1;
      }
       
      for (let t = N - 1; t >= limit; t--) {
        y2 = (y2 * top) / bottom;
        top--; 
        bottom--;
      }
       
      if (N / (N - X) >= y1 * Math.pow(y2, kmin1inv)) {
        Vprime = Math.pow(Math.random(), kmin1inv);
        break;
      }
 
      Vprime = Math.pow(Math.random(), kinv);
    }
 
    yield S;
 
    N -= S + 1;
    k--;
    kinv = kmin1inv;
    qu1 -= S;
    threshold += negalphainv;
  }
 
  if (k > 1) { // Method A
    let top = N - k;
   
    while (k >= 2) {
      const V = Math.random();
      let quot = top/N;

      S = 0;
      while (quot > V) {
        S++;
        top--;
        N--;
        quot *= top/N;
      }

      yield S;
      N--;
      k--;
    }

    yield Math.floor(N * Math.random());;
  } else {
    yield Math.floor(N * Vprime);
  }
}

export function * sample(k: number, N: number) {
  let a = 0;
  for (const S of skip(k, N)) {
    a += S;
    yield a++;
  }
}

export function sampleFrom<T>(deck: Iterable<T>, k: number, N: number): Generator<T>;
export function sampleFrom<T>(deck: Iterable<T> & { size: number }, k: number, N?: number): Generator<T>;
export function sampleFrom<T>(deck: Iterable<T> & { length: number }, k: number, N?: number): Generator<T>;
export function * sampleFrom<T>(deck: Iterable<T>, k: number, N: number = (deck as any).size || (deck as any).length) {
  if (!N || k > N) throw new Error("Invalid arguments");
  const g = deck[Symbol.iterator]();
  for (const S of skip(k, N)) {
    for (let i = 0; i < S; i++) g.next();
    yield g.next().value as T;
  }
}

export function * mask(k: number, N: number) {
  let i = 0;
  for (const s of skip(k, N)) {
    for (let j = 0; j < s; j++) yield false;
    yield true;
    i += s + 1;
  }

  while (i++ < N) yield false;
}

export function maskWith<T>(deck: Iterable<T>, k: number, N: number): Generator<[T, boolean]>;
export function maskWith<T>(deck: Iterable<T> & { size: number }, k: number, N?: number): Generator<[T, boolean]>;
export function maskWith<T>(deck: Iterable<T> & { length: number }, k: number, N?: number): Generator<[T, boolean]>;
export function * maskWith<T>(deck: Iterable<T>, k: number, N: number = (deck as any).size || (deck as any).length) {
  if (!N || k > N) throw new Error("Invalid arguments");
  const g = deck[Symbol.iterator]();
  for (const m of mask(k, N)) yield [ g.next().value as T, m ];
}

export function * partition(k1?: number, ...ks: number[]): Generator<number> {
  if (typeof k1 !== 'number') return;
  
  const l = ks.length - 1;
  if (l < 0) {
    for (let i = 0; i < k1; i++) yield 0;
    return;
  }

  // The last mask selects k_l elements from an N-sized deck.
  // The second-to-last mask selects k_l-1 elements from the
  // remaining N-k_l-sized deck; and so on.
  let N = k1;
  const masks = ks.map(k => mask(k, N += k));

  outer: for (let i = 0; i < N; i++) {
    for (let k = l; k >= 0; k--) {
      // If this one didn't match, check the next one.
      if (!masks[k].next().value) continue;
      // If this one did match, yield, and start over
      // checking all masks for the next element.
      yield k + 1;
      continue outer;
    }
    // If none of the masks matched, this element
    // must fit in the final k_1-sized partition.
    yield 0;
  }
}

export function * partitionWith<T>(deck: Iterable<T>, k1?: number, ...ks: number[]): Generator<[T, number]> {
  if (typeof k1 !== 'number') return;
  const g = deck[Symbol.iterator]();
  for (const b of partition(k1, ...ks)) yield [ g.next().value, b ];
}