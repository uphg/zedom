export function $all(selector, parent = document) {
  return Array.from(parent.querySelectorAll(selector))
}
