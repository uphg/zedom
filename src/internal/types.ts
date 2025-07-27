export type Key = string | number | symbol
export type MaybeArrayLike<T> = T | ArrayLike<T>
// export type MaybeNodes = MaybeArrayLike<Node | null>
export type RecursiveArrayLike<T> = ArrayLike<T | RecursiveArrayLike<T>>
export type RecursiveArray<T> = Array<T | RecursiveArray<T>>

