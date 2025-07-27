import splitClass from "./internal/splitClass"

function hasClass(el: HTMLElement, className: string) {
  if (!el || !className) return false
  if (el.classList) {
    return el.classList.contains(className)
  }

  return splitClass(el.getAttribute('class') || '').includes(className)
}

export default hasClass
