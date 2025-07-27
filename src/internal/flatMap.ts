function flatMap<T, R>(array: T[], callback: (item: T, index: number, array: T[]) => R | R[]): R[] {
  const length = array?.length || 0
  const result: R[] = []
  for (let i = 0; i < length; i++) {
    const item = callback(array[i], i, array)
    if (Array.isArray(item)) {
      result.push(...item)
    } else {
      result.push(item)
    }
  }
  return result
}

export default flatMap
