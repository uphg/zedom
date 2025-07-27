import type { StyleElement } from './internal/interface'
import isObject from './internal/isObject'
import camelize from "./internal/camelize";
import each from './internal/each'

function setStyle(
  el: StyleElement,
  styles: Record<string, string> | string,
  value?: string
) {
  if (isObject(styles)) {
    each(styles, (item, key) => {
      setStyle(el, key as string, item)
    })
    return
  }

  const styleName = camelize(styles as string)
  el.style[styleName] = value
}

export default setStyle
