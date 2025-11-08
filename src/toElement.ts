import { isNil } from 'unfunt'
import append from './append'

// See: https://stackoverflow.com/a/35385518
function toElement(innerHTML: string, children?: ArrayLike<Element>) {
  if (isNil(innerHTML)) return document.createElement(innerHTML)
  const template = document.createElement('template')
  template.innerHTML = innerHTML.trim?.()
  const node = template.content.firstChild! as Element

  if (children?.length) {
    append(node, children)
  }

  return node
}

export default toElement
