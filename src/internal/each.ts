import isArrayLike from "./isArrayLike";
import { Key } from "./types";

function each<T, K extends string>(
  object: T[] | Record<K, T>,
  callback: (item: T, inedx: number | string, object: T[] | Record<Key, T>) => void
) {
  if (isArrayLike(object)) {
    let index = -1
    const length = object.length
    while (++index < length) {
      callback((object as T[])[index], index, object)
    }
  } else {
    let index = -1
    const attrNames = Object.keys(object)
    const length = attrNames.length
    while (++index < length) {
      const key = attrNames[index]
      callback((object as Record<Key, T>)[key], key, object)
    }
  }
}

export default each
