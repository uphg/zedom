function findIndex<T>(array: ArrayLike<T>, callback: (item: T, index?: number, array?: ArrayLike<T>) => boolean, fromIndex = 0) {
  const { length } = array
  if (!length) {
    return -1
  }
  let index = fromIndex + -1
  while (++index < length) {
    if (callback(array[index], index, array)) {
      return index
    }
  }
  return -1
}

export default findIndex
