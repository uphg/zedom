import mergeClass from './internal/mergeClass'

function addClass(el: Element, ...args: string[] | string[][]) {
  const classNames = mergeClass(args)
  if (el.classList) {
    el.classList.add(...classNames)
    return
  }

  const className = (el.getAttribute('class') || '') + ` ${classNames.join(' ')}`
  el.setAttribute('class', className)
}

export default addClass
