import { MaybeArrayLike } from './internal/types'

function prepend(parent: Node, ...nodes: Array<MaybeArrayLike<Node | null>>) {
  const children = nodes.flat() as Node[]
  for (const el of children) {
    if (!el) return
    const { firstChild } = parent
    if (firstChild) {
      parent.insertBefore(el, firstChild)
    } else {
      parent.appendChild(el)
    }
  }
  return parent
}

export default prepend
