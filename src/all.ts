export function $all(selector: string, parent: ParentNode = document): Element[] {
  return Array.from(parent.querySelectorAll(selector))
}
