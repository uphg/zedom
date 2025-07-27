import each from "./internal/each"
import flatten from "./internal/flatten"
import { MaybeArrayLike } from "./internal/types"

function prepend(parent: Node, ...nodes: Array<MaybeArrayLike<Node | null>>) {
  const children = flatten(nodes) as Node[]
  each(children, (el) => {
    if (!el) return
    const { firstChild } = parent
    if (firstChild) {
      parent.insertBefore(el, firstChild)
    } else {
      parent.appendChild(el)
    }
  })
  return parent
}

export default prepend
