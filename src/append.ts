import each from "./internal/each"
import flatten from "./internal/flatten"
import { MaybeArrayLike } from "./internal/types"

function append(parent: Element, ...nodes: Array<MaybeArrayLike<Node | Element | null>>) {
  const children = flatten(nodes)
  each(children, (el) => {
    el && parent.appendChild(el as Node)
  })
  return parent
}

export default append
