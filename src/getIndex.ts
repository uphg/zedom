function getIndex<T extends Element>(el: T | null) {
  const children = el?.parentNode?.children
  if (!children) return -1
  return Array.from(children).findIndex(item => item === el)
}

export default getIndex
