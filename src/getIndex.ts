import findIndex from "./internal/findIndex"

function getIndex<T extends Element>(el: T | null) {
  const children = el?.parentNode?.children
  if (!children) return -1
  return findIndex(children, (item) => item === el)
}

export default getIndex
