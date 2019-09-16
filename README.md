# vitter-sample
Implementation of J. S. Vitter's Method D for sequential random sampling, from
`Vitter, J.S. - An Efficient Algorithm for Sequential Random Sampling - ACM Trans. Math. Software 11 (1985), 37-57.`

This package exports three generator functions:

* `function * skip(k: number, N: number): Generator<number>` Returns the sequence of intervals (skips) between sample points to sequentially sample `k` random elements from a deck of size `N`.
* `function * sample(n: number, N: number): Generator<number>` Returns the sequence of actual sample indices to sample `k` elements from a deck of size `N`.
* `function * sampleFrom<T>(deck: Iterable<T>, n: number, N?: number): Generator<T>` Returns the sequence of actual elements sampled from a given deck; if the deck has a `size` or `length` property (e.g., it is a `Set`, `Array`, etc.), the `N` argument is optional.