export type GetScrollParentNode = Element | HTMLElement | Document | null

const reOverflowScroll = /(auto|scroll|overlay)/

function getScrollParent<T extends Node>(node: T): GetScrollParentNode {
  if (node === null) return null

  const parentNode = getParentNode(node) as HTMLElement

  if (parentNode === null) {
    return null
  }

  if (parentNode.nodeType === 9) {
    return document
  }

  if (parentNode?.nodeType === 1) {
    const { overflow, overflowX, overflowY } = getComputedStyle(parentNode)
    if (reOverflowScroll.test(overflow + overflowX + overflowY)) {
      return parentNode
    }
  }

  return getScrollParent(parentNode)
}

function getParentNode(node: Node): Node | null {
  // document type === 9
  return node.nodeType === 9 ? null : node.parentNode
}

export default getScrollParent
