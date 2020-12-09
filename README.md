# vitter-sample
Implementation of J. S. Vitter's Method D for sequential random sampling, from
`Vitter, J.S. - An Efficient Algorithm for Sequential Random Sampling - ACM Trans. Math. Software 11 (1985), 37-57.`

This package exports seven generator functions:

* `function * skip(k: number, N: number): Generator<number>` Returns the sequence of intervals (skips) between sample points to sequentially sample `k` random elements from a deck of size `N`.
* `function * sample(k: number, N: number): Generator<number>` Returns the sequence of actual sample indices to sample `k` elements from a deck of size `N`.
* `function * sampleFrom<T>(deck: Iterable<T>, k: number, N?: number): Generator<T>` Returns the sequence of actual elements sampled from a given deck; if the deck has a `size` or `length` property (e.g., it is a `Set`, `Array`, etc.), the `N` argument is optional.
* `function * mask(k: number, N: number): Generator<boolean>` Returns a sequence of true or false values indicating whether the corresponding index should be sampled.
* `function * maskWith<T>(deck: Iterable<T>, k: number, N?: number): Generator<[T, boolean]>` Returns a sequence of pairs of items from the input deck along with true or false values indicating whether that item should be sampled.
* `function * partition(...ks: number[]): Generator<number>` A generalization of `mask` to more than two categories. Given a list of bucket sizes (with `N` implicitly set to the sum of all bucket sizes), produces a sequence of integers indicating which buckets each sequential index should be sorted into. If the list of bucket sizes is empty, or all buckets have zero size, the generator yields no values. Individual bucket sizes of zero will result in gaps in the set of output integers, as no items will be sorted into those buckets.
* `function * partitionWith<T>(deck: Iterable<T>, ...ks: number[]): Generator<[T, boolean]>` A generalization of `maskWith` to more than two categories. Given a list of bucket sizes (with `N` implicitly set to the sum of all bucket sizes), returns a sequence of pairs of items from the input deck along with an integer indicating which bucket that item should be sorted into. If the list of bucket sizes is empty, or all buckets have zero size, the generator yields no values, and the input deck `Iterable` is not consumed. Individual bucket sizes of zero will result in gaps in the set of output integers, as no items will be sorted into those buckets.
