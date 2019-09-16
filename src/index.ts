//Vitter, J.S. - An Efficient Algorithm for Sequential Random Sampling - ACM Trans. Math. Software 11 (1985), 37-57.

const negalphainv = -13;
export function * skip(k: number, N: number) {
  let qu1 = N - k + 1; 
  let S = 0; 
  let threshold = -negalphainv*k;
 
  let kinv = 1/k;
  let Vprime = Math.pow(Math.random(), kinv);
 
  let X = 0;

  while (k > 1 && threshold < N) {
    const kmin1inv = 1/(k - 1);
 
    for (;;) {
      for (;;) {
        X = N * (1 - Vprime);
        S = Math.floor(X);
 
        if (S < qu1) {
          break;
        }
 
        Vprime = Math.pow(Math.random(), kinv);
      }

      const y1 = Math.pow(Math.random() * N / qu1, kmin1inv);
      Vprime = y1 * (1 - X / N) * (qu1 / (qu1 - S));
       
      if (Vprime <= 1) {
        break;
      }
       
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
      k--;
    }
   
    yield Math.floor(N * Math.random());
  } else {
    yield Math.floor(N * Vprime);
  }
}

export function * sample(k: number, N: number) {
  let a = 0;
  for (const S of skip(k, N)) {
    a += S;
    yield a;
    a++;
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