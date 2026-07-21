import { isNil } from './internal/isNil'

export function toElement(innerHTML: string, children?: ArrayLike<Element>) {
  if (isNil(innerHTML)) return document.createElement('div')
  const template = document.createElement('template')
  template.innerHTML = innerHTML.trim?.()
  const node = template.content.firstChild! as Element

  if (children?.length) {
    node.append(...Array.from(children))
  }

  return node
}
