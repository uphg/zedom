export function getSiblings<T extends Element>(el: T | null | undefined): T[] {
  if (!el || !el.parentNode) return []
  return Array.from(el.parentNode.children).filter(item => item !== el) as T[]
}
