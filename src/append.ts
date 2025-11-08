import { MaybeArrayLike } from './internal/types'

function append(parent: Element, ...nodes: Array<MaybeArrayLike<Node | Element | null | undefined>>) {
  const children = nodes.flat()

  for (const el of children) {
    el && parent.appendChild(el as Node)
  }

  return parent
}

export default append
