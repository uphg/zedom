export function isNode(value: unknown): value is Node {
  return value instanceof Node
}

export function isElement(value: unknown): value is Element {
  return value instanceof Element
}

export function isHTMLElement(value: unknown): value is HTMLElement {
  return value instanceof HTMLElement
}

export function isSVGElement(value: unknown): value is SVGElement {
  return value instanceof SVGElement
}
