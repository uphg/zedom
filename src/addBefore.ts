function addBefore<T extends Node, N extends Node>(el: T, newNode: N) {
  return el?.parentNode?.insertBefore(newNode, el)
}

export default addBefore
