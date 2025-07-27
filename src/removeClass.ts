import each from './internal/each'
import splitClass from './internal/splitClass'
import mergeClass from './internal/mergeClass'

function removeClass(el: Element, ...args: string[]) {
  const classNames = mergeClass(args)
  if (el.classList) {
    el.classList.remove(...classNames)
    return
  }

  let prev = el.getAttribute('class') || ''
  each(classNames, (item) => {
    prev = prev.replace(` ${item} `, '')
  })
  const mergings = splitClass(prev)
  mergings && el.setAttribute('class', mergings.join(' '))
}

export default removeClass
