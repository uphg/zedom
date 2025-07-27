function removeChildren<T extends Element>(el: T) {
  if (!el) return
  while (el.hasChildNodes()) {
    el.removeChild(el.lastChild!)
  }
}

export default removeChildren
