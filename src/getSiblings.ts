function getSiblings<T extends Element>(el: T) {
  if (!el) return []

  const children = el.parentNode?.children!
  const length = children.length
  let index = -1
  const result = []
  while (++index < length) {
    const item = children[index]
    if (item === el) continue
    result.push(item)
  }
  return result
}

export default getSiblings