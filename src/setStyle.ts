import type { StyleElement } from './internal/types'
import { isObject, camelize, forEachEntry } from 'unfunt'

export function setStyle(el: StyleElement, styles: Record<string, string> | string, value?: string) {
  if (isObject(styles)) {
    forEachEntry(styles, (key, item) => {
      setStyle(el, key as string, item)
    })
    return
  }

  const styleName = camelize(styles as string)
  el.style[styleName] = value
}
