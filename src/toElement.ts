import { isNil } from 'unfunt'

// See: https://stackoverflow.com/a/35385518
export function toElement(innerHTML: string, children?: ArrayLike<Element>) {
  if (isNil(innerHTML)) return document.createElement(innerHTML)
  const template = document.createElement('template')
  template.innerHTML = innerHTML.trim?.()
  const node = template.content.firstChild! as Element

  if (children?.length) {
    node.append(...Array.from(children))
  }

  return node
}
