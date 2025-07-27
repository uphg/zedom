import isArray from "./isArray"
import isArrayLike from "./isArrayLike"
import { RecursiveArray, RecursiveArrayLike } from "./types"

function flatten<T>(array: RecursiveArrayLike<T>) {
  const length = array?.length || 0
  const result: RecursiveArray<T> = []
  let index = -1

  while (++index < length) {
    const item = array[index]
    if (isArrayLike(item)) {
      result.push(...(isArray(item) ? item : Array.from(item)))
    } else {
      result.push(item)
    }
  }
  return result
}

export default flatten
